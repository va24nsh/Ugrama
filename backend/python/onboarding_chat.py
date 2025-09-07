from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
import os

# --- Database Import ---
try:
    from course_database import COURSE_DATABASE
except ImportError:
    # Fallback course data if import fails
    COURSE_DATABASE = [
        {
            "id": "1",
            "title": "Full-Stack Web Development Mastery",
            "description": "Learn to build modern web applications from scratch using React, Node.js, Express, and MongoDB.",
            "price": 199.0,
            "duration": 12,
            "level": "Beginner",
            "thumbnail": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
            "category": "Web Development",
            "educatorId": "sarah-chen",
            "published": True
        },
        {
            "id": "2",
            "title": "Data Science with Python",
            "description": "Comprehensive introduction to data science using Python. Learn pandas, numpy, matplotlib, and scikit-learn.",
            "price": 299.0,
            "duration": 16,
            "level": "Intermediate",
            "thumbnail": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
            "category": "Data Science",
            "educatorId": "emily-watson",
            "published": True
        },
        {
            "id": "3",
            "title": "UI/UX Design Fundamentals",
            "description": "Learn the principles of user interface and user experience design. Master design tools like Figma.",
            "price": 149.0,
            "duration": 8,
            "level": "Beginner",
            "thumbnail": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
            "category": "Design",
            "educatorId": "alex-rodriguez",
            "published": True
        }
    ]

load_dotenv()

# --- Pydantic Models ---
class RAGRequest(BaseModel):
    query: str
    level: Optional[str] = None

class Course(BaseModel):
    id: str
    title: str
    description: str
    price: float
    duration: int
    level: str
    thumbnail: str
    category: str
    educatorId: str
    published: bool

class RAGResponse(BaseModel):
    courses: List[Course]
    warning: Optional[str] = None

# --- FastAPI App ---
app = FastAPI(title="Course Recommender", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def simple_search(query: str, level: Optional[str] = None):
    """Simple keyword-based search algorithm"""
    if not query.strip():
        return COURSE_DATABASE[:3], None
    
    query_lower = query.lower()
    keywords = query_lower.split()
    
    scored_courses = []
    
    for course in COURSE_DATABASE:
        score = 0
        course_text = f"{course['title']} {course['description']} {course['category']}".lower()
        
        # Score based on keyword matches
        for keyword in keywords:
            if keyword in course_text:
                score += course_text.count(keyword)
        
        # Bonus scoring
        if any(keyword in course['category'].lower() for keyword in keywords):
            score += 10  # Category match bonus
        
        if any(keyword in course['title'].lower() for keyword in keywords):
            score += 5   # Title match bonus
        
        # Web development related keywords
        web_keywords = ['web', 'react', 'javascript', 'html', 'css', 'frontend', 'backend', 'fullstack', 'full-stack']
        if any(keyword in web_keywords for keyword in keywords):
            if 'web development' in course['category'].lower():
                score += 15
        
        # Data science related keywords
        data_keywords = ['data', 'science', 'python', 'machine', 'learning', 'ai', 'analytics']
        if any(keyword in data_keywords for keyword in keywords):
            if 'data science' in course['category'].lower() or 'machine learning' in course['category'].lower():
                score += 15
        
        # Design related keywords
        design_keywords = ['design', 'ui', 'ux', 'figma', 'prototype', 'wireframe']
        if any(keyword in design_keywords for keyword in keywords):
            if 'design' in course['category'].lower():
                score += 15
        
        if score > 0:
            scored_courses.append((course, score))
    
    # Sort by score and take top courses
    scored_courses.sort(key=lambda x: x[1], reverse=True)
    recommended_courses = [course for course, score in scored_courses[:6]]
    
    # If no matches, return default popular courses
    if not recommended_courses:
        recommended_courses = COURSE_DATABASE[:3]
    
    # Filter by level if specified
    warning = None
    if level:
        level_filtered = [c for c in recommended_courses if c['level'].lower() == level.lower()]
        if level_filtered:
            recommended_courses = level_filtered[:3]
        else:
            warning = f"No courses found for level '{level}'. Showing best matches instead."
            recommended_courses = recommended_courses[:3]
    else:
        recommended_courses = recommended_courses[:3]
    
    return recommended_courses, warning

@app.get("/")
def root():
    return {
        "message": "Course Recommendation API is running!", 
        "version": "1.0.0",
        "status": "healthy",
        "total_courses": len(COURSE_DATABASE)
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "service": "course-recommendations",
        "courses_loaded": len(COURSE_DATABASE)
    }

@app.get("/courses")
def get_all_courses():
    """Get all available courses"""
    return {"courses": COURSE_DATABASE, "total": len(COURSE_DATABASE)}

@app.post("/courserecommendations", response_model=RAGResponse)
def get_recommendations_endpoint(request: RAGRequest):
    try:
        print(f"Received query: '{request.query}' with level: '{request.level}'")
        
        courses, warning = simple_search(request.query, request.level)
        
        print(f"Found {len(courses)} courses")
        for course in courses:
            print(f"  - {course['title']} ({course['level']})")
        
        course_objects = [Course(**course) for course in courses]
        
        return RAGResponse(courses=course_objects, warning=warning)
        
    except Exception as e:
        print(f"Error in recommendations: {str(e)}")
        # Return fallback courses on error
        fallback_courses = [Course(**course) for course in COURSE_DATABASE[:3]]
        return RAGResponse(
            courses=fallback_courses, 
            warning="Using fallback recommendations due to technical issues."
        )

if __name__ == "__main__":
    import uvicorn
    print("Starting Course Recommendation API...")
    print(f"Loaded {len(COURSE_DATABASE)} courses")
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)