import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Users, Star, Clock, DollarSign } from "lucide-react";

interface Course {
  id: string;
  title: string;
  educator: string;
  rating: number;
  studentsEnrolled: number;
  duration: string;
  price: number;
  usp: string;
  thumbnail: string;
  tags: string[];
}

const RECOMMENDED_COURSES: Course[] = [
  {
    id: "1",
    title: "Full-Stack Web Development Mastery",
    educator: "Sarah Chen",
    rating: 4.9,
    studentsEnrolled: 2543,
    duration: "12 weeks",
    price: 199,
    usp: "Build 5 real projects with personalized mentorship",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    tags: ["React", "Node.js", "MongoDB", "JavaScript"]
  },
  {
    id: "2", 
    title: "UI/UX Design: From Figma to Reality",
    educator: "Alex Rodriguez",
    rating: 4.8,
    studentsEnrolled: 1876,
    duration: "8 weeks",
    price: 149,
    usp: "Design apps used by 10M+ users with industry secrets",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    tags: ["Figma", "Design Systems", "Prototyping", "UX Research"]
  },
  {
    id: "3",
    title: "Data Science & Machine Learning",
    educator: "Dr. Emily Watson",
    rating: 4.9,
    studentsEnrolled: 3421,
    duration: "16 weeks",
    price: 299,
    usp: "Work on real datasets from Fortune 500 companies",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    tags: ["Python", "TensorFlow", "Pandas", "Statistics"]
  }
];

const Recommendations = () => {
  const navigate = useNavigate();

  const handleEnrollNow = (courseId: string, price: number) => {
    localStorage.setItem("selected_course_id", courseId);
    localStorage.setItem("course_price", price.toString());
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b-4 border-foreground p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-foreground mb-2">
            🎯 Recommended Just For You
          </h1>
          <p className="text-muted-foreground">
            Based on your interests and goals, here are the perfect courses to start your learning journey!
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {RECOMMENDED_COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-card border-4 border-foreground rounded-lg shadow-brutal hover:shadow-brutal-lg transition-all duration-300 overflow-hidden"
            >
              {/* Course Image */}
              <div className="h-48 bg-gradient-accent relative overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-ugram-yellow text-foreground border-2 border-foreground">
                    ⭐ {course.rating}
                  </Badge>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  by <span className="font-semibold text-foreground">{course.educator}</span>
                </p>

                {/* USP */}
                <p className="text-sm text-foreground bg-ugram-purple p-3 rounded-lg border-2 border-foreground mb-4">
                  💡 {course.usp}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.studentsEnrolled.toLocaleString()} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold text-foreground">${course.price}</span>
                  </div>
                  <Button
                    variant="brutal"
                    size="sm"
                    onClick={() => handleEnrollNow(course.id, course.price)}
                    className="bg-ugram-green text-white border-foreground"
                  >
                    Pay Now 💳
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 p-8 bg-gradient-primary rounded-lg border-4 border-foreground shadow-brutal">
          <h2 className="text-2xl font-black text-foreground mb-4">
            Ready to Transform Your Future? 🚀
          </h2>
          <p className="text-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of students who've already started their journey to success. 
            Don't wait – your dream skillset is just one click away!
          </p>
          <Button
            variant="brutal"
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="bg-card text-foreground border-foreground"
          >
            View All Courses 📚
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;