from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from dotenv import load_dotenv
import os

# Import the study vibe functionality
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document

# ... existing course database import ...
try:
    from course_database import COURSE_DATABASE
except ImportError:
    # Fallback: define a minimal COURSE_DATABASE if import fails
    COURSE_DATABASE = [
        {
            "id": "1",
            "title": "Sample Course",
            "description": "This is a fallback course.",
            "price": 0.0,
            "duration": 1,
            "level": "Beginner",
            "thumbnail": "",
            "category": "General",
            "educatorId": "0",
            "published": True
        }
    ]

# Study Vibe Database
STUDY_VIBES_DATABASE = [
    {
        "vibe_tag": "lofi_pomodoro_night",
        "parameters": {"sound": "lofi", "rhythm": "pomodoro", "time": "night"},
        "description": "A focused night owl who enjoys lo-fi beats and works in structured Pomodoro sprints. Perfect for late-night coding sessions and deep work."
    },
    {
        "vibe_tag": "classical_marathon_morning",
        "parameters": {"sound": "classical", "rhythm": "marathon", "time": "morning"},
        "description": "An early bird who achieves deep focus in long, uninterrupted sessions with classical music. Great for comprehensive learning."
    },
    {
        "vibe_tag": "ambient_casual_afternoon",
        "parameters": {"sound": "ambient", "rhythm": "casual", "time": "afternoon"},
        "description": "A relaxed learner who studies at a flexible pace in the afternoon with soothing ambient sounds. Ideal for review and practice."
    },
    {
        "vibe_tag": "silence_marathon_night",
        "parameters": {"sound": "silence", "rhythm": "marathon", "time": "night"},
        "description": "A late-night studier who prefers absolute silence for long, deep work sessions. Perfect for intensive problem-solving."
    },
    {
        "vibe_tag": "nature_pomodoro_morning",
        "parameters": {"sound": "nature", "rhythm": "pomodoro", "time": "morning"},
        "description": "A morning person who loves nature sounds and structured breaks. Great for focused learning with regular refreshers."
    },
    {
        "vibe_tag": "electronic_casual_evening",
        "parameters": {"sound": "electronic", "rhythm": "casual", "time": "evening"},
        "description": "An evening learner who enjoys electronic music and flexible study sessions. Perfect for creative projects and exploration."
    }
]

load_dotenv()

# Pydantic Models
class RAGRequest(BaseModel):
    query: str
    level: Optional[str] = None

class VibeRequest(BaseModel):
    user_id: str
    description: str

class UserProfileResponse(BaseModel):
    user_id: str
    vibe_tag: str
    parameters: Dict[str, str]
    description: str
    recommendations: List[str] = []

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

# FastAPI App
app = FastAPI(title="Enhanced Course Recommender with Study Vibe Profiler", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Study Vibe Retriever
def initialize_vibe_retriever():
    """
    Creates the core components of our vibe matching system once.
    """
    try:
        # Convert vibe data into LangChain Document objects
        documents = []
        for vibe in STUDY_VIBES_DATABASE:
            doc = Document(page_content=vibe["description"], metadata=vibe)
            documents.append(doc)
        
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_store = FAISS.from_documents(documents, embeddings)
        return vector_store.as_retriever(search_kwargs={"k": 1})

    except Exception as e:
        print(f"WARNING: Could not initialize vector retriever; falling back to simple keyword retriever: {e}")

        # Simple fallback retriever
        class SimpleRetriever:
            def __init__(self, db):
                self.db = db

            def get_relevant_documents(self, query: str):
                q = (query or "").lower()
                best = None
                best_score = -1
                
                for vibe in self.db:
                    score = 0
                    # Parameter keywords match (higher weight)
                    for v in vibe.get('parameters', {}).values():
                        if v and v.lower() in q:
                            score += 3
                    
                    # Description keyword overlap
                    for token in vibe.get('description', '').split():
                        t = token.lower().strip('.,')
                        if t and t in q:
                            score += 1
                    
                    if score > best_score:
                        best_score = score
                        best = vibe

                # If nothing matched, return the first profile as default
                if best is None:
                    best = self.db[0]

                return [Document(page_content=best['description'], metadata=best)]

        return SimpleRetriever(STUDY_VIBES_DATABASE)

# Initialize the vibe retriever
vibe_retriever = initialize_vibe_retriever()

# Helper function to generate study recommendations based on vibe
def generate_study_recommendations(vibe_tag: str, parameters: Dict[str, str]) -> List[str]:
    """Generate personalized study recommendations based on user's vibe profile"""
    recommendations = []
    
    # Time-based recommendations
    if parameters.get("time") == "morning":
        recommendations.extend([
            "🌅 Start with easier topics in the morning when your mind is fresh",
            "☕ Take advantage of your natural energy peak for complex concepts"
        ])
    elif parameters.get("time") == "night":
        recommendations.extend([
            "🌙 Perfect time for review and practice problems",
            "🧠 Use the quiet hours for deep, focused learning"
        ])
    elif parameters.get("time") == "afternoon":
        recommendations.extend([
            "☀️ Great time for collaborative learning and discussions",
            "📝 Ideal for hands-on projects and practical exercises"
        ])

    # Rhythm-based recommendations
    if parameters.get("rhythm") == "pomodoro":
        recommendations.extend([
            "⏰ Use 25-minute focused sessions with 5-minute breaks",
            "🎯 Set specific learning goals for each Pomodoro session",
            "📊 Track your progress to stay motivated"
        ])
    elif parameters.get("rhythm") == "marathon":
        recommendations.extend([
            "📚 Plan longer study blocks for comprehensive understanding",
            "💧 Remember to stay hydrated during extended sessions",
            "🎯 Focus on one major topic per session"
        ])
    elif parameters.get("rhythm") == "casual":
        recommendations.extend([
            "🌊 Go with the flow - study when you feel motivated",
            "🔄 Mix different types of learning activities",
            "📝 Keep a flexible schedule that adapts to your mood"
        ])

    # Sound-based recommendations
    if parameters.get("sound") == "lofi":
        recommendations.extend([
            "🎵 Try Brain.fm or Lofi Girl for consistent background music",
            "🎧 Use noise-canceling headphones for better focus"
        ])
    elif parameters.get("sound") == "classical":
        recommendations.extend([
            "🎼 Mozart and Bach are excellent for concentration",
            "🎹 Instrumental pieces help maintain focus without distraction"
        ])
    elif parameters.get("sound") == "silence":
        recommendations.extend([
            "🤫 Find a quiet space away from distractions",
            "📵 Use Do Not Disturb mode on your devices"
        ])
    elif parameters.get("sound") == "nature":
        recommendations.extend([
            "🌊 Ocean waves or rain sounds can improve concentration",
            "🌲 Forest sounds create a calming learning environment"
        ])

    # General recommendations
    recommendations.extend([
        "📱 Use the built-in note-taking feature to capture key insights",
        "❓ Mark timestamps when you have doubts for easy review",
        "👥 Join study groups to connect with peers",
        "🏆 Celebrate small wins to maintain motivation"
    ])

    return recommendations[:6]  # Return top 6 recommendations

# Course recommendation function (existing)
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
            score += 10
        
        if any(keyword in course['title'].lower() for keyword in keywords):
            score += 5
        
        # Category-specific bonuses
        web_keywords = ['web', 'react', 'javascript', 'html', 'css', 'frontend', 'backend', 'fullstack', 'full-stack']
        if any(keyword in web_keywords for keyword in keywords):
            if 'web development' in course['category'].lower():
                score += 15
        
        data_keywords = ['data', 'science', 'python', 'machine', 'learning', 'ai', 'analytics']
        if any(keyword in data_keywords for keyword in keywords):
            if 'data science' in course['category'].lower() or 'machine learning' in course['category'].lower():
                score += 15
        
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

# API Endpoints
@app.get("/")
def root():
    return {
        "message": "Enhanced Course Recommendation API with Study Vibe Profiler!", 
        "version": "2.0.0",
        "status": "healthy",
        "total_courses": len(COURSE_DATABASE),
        "available_vibes": len(STUDY_VIBES_DATABASE)
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "service": "enhanced-course-recommendations",
        "courses_loaded": len(COURSE_DATABASE),
        "vibes_loaded": len(STUDY_VIBES_DATABASE)
    }

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
        fallback_courses = [Course(**course) for course in COURSE_DATABASE[:3]]
        return RAGResponse(
            courses=fallback_courses, 
            warning="Using fallback recommendations due to technical issues."
        )

@app.post("/get-study-vibe-profile", response_model=UserProfileResponse)
def get_vibe_profile_endpoint(request: VibeRequest):
    """
    Receives a user's natural language description of their study habits
    and returns the best matching structured profile with personalized recommendations.
    """
    if not vibe_retriever:
        raise HTTPException(status_code=503, detail="Study vibe profiling service is currently unavailable.")

    try:
        # Use the retriever to find the single best matching vibe document
        retrieved_docs = vibe_retriever.get_relevant_documents(request.description)
        
        if not retrieved_docs:
            raise HTTPException(status_code=404, detail="Could not determine a study vibe from your description. Please try rephrasing.")

        # Extract the structured profile data from the document's metadata
        best_match_profile = retrieved_docs[0].metadata
        
        # Generate personalized recommendations
        recommendations = generate_study_recommendations(
            best_match_profile["vibe_tag"], 
            best_match_profile["parameters"]
        )
        
        # Create response
        response_data = {
            "user_id": request.user_id,
            "vibe_tag": best_match_profile["vibe_tag"],
            "parameters": best_match_profile["parameters"],
            "description": best_match_profile["description"],
            "recommendations": recommendations
        }
        
        print(f"Generated study vibe profile for user {request.user_id}: {best_match_profile['vibe_tag']}")
        
        return UserProfileResponse(**response_data)
        
    except Exception as e:
        print(f"Error in vibe profiling: {str(e)}")
        # Return default profile on error
        default_profile = STUDY_VIBES_DATABASE[0]
        recommendations = generate_study_recommendations(
            default_profile["vibe_tag"], 
            default_profile["parameters"]
        )
        
        return UserProfileResponse(
            user_id=request.user_id,
            vibe_tag=default_profile["vibe_tag"],
            parameters=default_profile["parameters"],
            description=default_profile["description"],
            recommendations=recommendations
        )

@app.get("/available-vibes")
def get_available_vibes():
    """Get all available study vibe profiles"""
    return {
        "vibes": STUDY_VIBES_DATABASE,
        "total": len(STUDY_VIBES_DATABASE)
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting Enhanced Course Recommendation API with Study Vibe Profiler...")
    print(f"Loaded {len(COURSE_DATABASE)} courses")
    print(f"Loaded {len(STUDY_VIBES_DATABASE)} study vibes")
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)