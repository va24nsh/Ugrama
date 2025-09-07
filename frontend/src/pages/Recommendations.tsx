import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Users, Star, Clock, DollarSign, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  level: string;
  thumbnail: string;
  category: string;
  educatorId: string;
  published: boolean;
}

interface RAGResponse {
  courses: Course[];
  warning?: string;
}

const Recommendations = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Default recommendations query
  const defaultQuery = "I want to learn web development and programming";

  // Fetch recommendations from RAG backend
  const fetchRecommendations = async (query: string, level?: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8001/courserecommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query || defaultQuery,
            level: level || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RAGResponse = await response.json();
      setCourses(data.courses);

      if (data.warning) {
        toast({
          title: "Note",
          description: data.warning,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch recommendations. Please try again.",
        variant: "destructive",
      });

      // Fallback to default courses if API fails
      setCourses([
        {
          id: "1",
          title: "Full-Stack Web Development Mastery",
          description: "Build 5 real projects with personalized mentorship",
          price: 199,
          duration: 12,
          level: "Intermediate",
          thumbnail:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
          category: "Web Development",
          educatorId: "sarah-chen",
          published: true,
        },
        {
          id: "2",
          title: "UI/UX Design: From Figma to Reality",
          description: "Design apps used by 10M+ users with industry secrets",
          price: 149,
          duration: 8,
          level: "Beginner",
          thumbnail:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
          category: "Design",
          educatorId: "alex-rodriguez",
          published: true,
        },
        {
          id: "3",
          title: "Data Science & Machine Learning",
          description: "Work on real datasets from Fortune 500 companies",
          price: 299,
          duration: 16,
          level: "Advanced",
          thumbnail:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
          category: "Data Science",
          educatorId: "emily-watson",
          published: true,
        },
      ]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Load initial recommendations
  useEffect(() => {
    fetchRecommendations(defaultQuery);
  }, []);

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchRecommendations(searchQuery, selectedLevel);
    }
  };

  // Handle level filter
  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    fetchRecommendations(searchQuery || defaultQuery, level);
  };

  const handleEnrollNow = (courseId: string, price: number) => {
    localStorage.setItem("selected_course_id", courseId);
    localStorage.setItem("course_price", price.toString());
    navigate("/payment");
  };

  const formatDuration = (weeks: number) => {
    return `${weeks} week${weeks > 1 ? "s" : ""}`;
  };

  if (initialLoad && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading personalized recommendations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Results Count */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <p className="text-sm text-muted-foreground mb-4">
          Found {courses.length} course{courses.length !== 1 ? "s" : ""} for you
        </p>
      </div>

      {/* Courses Grid */}
      <div className="max-w-6xl mx-auto p-6">
        {loading && !initialLoad ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              Finding the best courses for you...
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No courses found. Try a different search term.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("");
                fetchRecommendations(defaultQuery);
              }}
            >
              Show Default Recommendations
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop`;
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-ugram-yellow text-foreground border-2 border-foreground">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-ugram-purple text-white border-2 border-foreground">
                      {course.category}
                    </Badge>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-foreground bg-ugram-green p-3 rounded-lg border-2 border-foreground mb-4 line-clamp-3">
                    💡 {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(course.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      4.8
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-xl font-bold text-foreground">
                        ${course.price}
                      </span>
                    </div>
                    <Button
                      variant="brutal"
                      size="sm"
                      onClick={() => handleEnrollNow(course.id, course.price)}
                      className="bg-ugram-green text-white border-foreground"
                    >
                      Enroll Now 💳
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-12 p-8 bg-gradient-primary rounded-lg border-4 border-foreground shadow-brutal">
          <h2 className="text-2xl font-black text-foreground mb-4">
            Ready to Transform Your Future? 🚀
          </h2>
          <p className="text-foreground mb-6 max-w-2xl mx-auto">
            Our AI has analyzed thousands of courses to find the perfect match
            for your goals. Don't wait – your dream skillset is just one click
            away!
          </p>
          <Button
            variant="brutal"
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="bg-card text-foreground border-foreground"
          >
            Explore More Courses 📚
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
