import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Calendar, 
  Play,
  Plus,
  DollarSign,
  Star,
  MessageSquare,
  User,
  BarChart3
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  user_type: "student" | "educator";
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("accessToken");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock data
  const mockStudentCourses = [
    {
      id: "1",
      title: "Full-Stack Web Development",
      educator: "Sarah Chen",
      progress: 65,
      nextLesson: "Building REST APIs",
      totalLessons: 48,
      completedLessons: 31
    },
    {
      id: "2", 
      title: "UI/UX Design Fundamentals",
      educator: "Alex Rodriguez",
      progress: 45,
      nextLesson: "Prototyping in Figma",
      totalLessons: 32,
      completedLessons: 14
    }
  ];

  const mockEducatorCourses = [
    {
      id: "1",
      title: "React Advanced Patterns",
      enrollments: 245,
      revenue: 12250,
      rating: 4.8,
      students: 245
    },
    {
      id: "2",
      title: "JavaScript Mastery Course", 
      enrollments: 189,
      revenue: 9450,
      rating: 4.9,
      students: 189
    }
  ];

  const upcomingSessions = [
    { title: "Live Q&A Session", time: "Today, 3:00 PM", course: "Web Development" },
    { title: "Project Review", time: "Tomorrow, 10:00 AM", course: "UI/UX Design" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b-4 border-foreground p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black text-foreground">Ugram</h1>
            <nav className="hidden md:flex gap-6">
              {user.user_type === "student" ? (
                <>
                  <Button variant="ghost" className="font-semibold">Browse Courses</Button>
                  <Button variant="ghost" className="font-semibold">My Courses</Button>
                  <Button variant="ghost" className="font-semibold">Messages</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="font-semibold">My Courses</Button>
                  <Button variant="ghost" className="font-semibold">Analytics</Button>
                  <Button variant="ghost" className="font-semibold">Earnings</Button>
                  <Button variant="ghost" className="font-semibold">Messages</Button>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="brutal" size="sm" onClick={() => {
              localStorage.removeItem("ugram_user");
              navigate("/login");
            }}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-foreground mb-2">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            {user.user_type === "student" 
              ? "Ready to continue your learning journey?"
              : "Let's see how your courses are performing today."
            }
          </p>
        </div>

        {user.user_type === "student" ? (
          // STUDENT DASHBOARD
          <div className="space-y-8">
            {/* My Enrolled Courses */}
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-4">📚 My Enrolled Courses</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {mockStudentCourses.map((course) => (
                  <Card key={course.id} className="border-4 border-foreground shadow-brutal">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{course.title}</span>
                        <Badge variant="outline" className="border-foreground">
                          {course.progress}% Complete
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">by {course.educator}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={course.progress} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{course.completedLessons}/{course.totalLessons} lessons completed</span>
                        <span>Next: {course.nextLesson}</span>
                      </div>
                      <Button 
                        variant="brutal" 
                        className="w-full"
                        onClick={() => navigate("/course-module")}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recommended Courses */}
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-4">🎯 Recommended For You</h3>
              <div className="bg-gradient-accent p-6 rounded-lg border-4 border-foreground shadow-brutal">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">Data Science Fundamentals</h4>
                    <p className="text-sm text-muted-foreground">Perfect match based on your interests!</p>
                  </div>
                  <Button variant="brutal" onClick={() => navigate("/recommendations")}>
                    View Details
                  </Button>
                </div>
              </div>
            </section>

            {/* Upcoming Live Sessions */}
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-4">📅 Upcoming Live Sessions</h3>
              <div className="space-y-3">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border-2 border-foreground flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">{session.course} • {session.time}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          // EDUCATOR DASHBOARD
          <div className="space-y-8">
            {/* Quick Actions */}
            <section>
              <div className="bg-gradient-primary p-6 rounded-lg border-4 border-foreground shadow-brutal mb-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
                <Button variant="brutal" size="lg" className="bg-ugram-green text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create a New Course
                </Button>
              </div>
            </section>

            {/* Analytics Overview */}
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-4">📊 Analytics Overview</h3>
              <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-4 border-foreground shadow-brutal">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-ugram-blue" />
                    <p className="text-2xl font-bold">434</p>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                  </CardContent>
                </Card>
                <Card className="border-4 border-foreground shadow-brutal">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-ugram-green" />
                    <p className="text-2xl font-bold">$21,700</p>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                  </CardContent>
                </Card>
                <Card className="border-4 border-foreground shadow-brutal">
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-ugram-yellow" />
                    <p className="text-2xl font-bold">4.85</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </CardContent>
                </Card>
                <Card className="border-4 border-foreground shadow-brutal">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-ugram-pink" />
                    <p className="text-2xl font-bold">+15%</p>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* My Created Courses */}
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-4">📚 My Created Courses</h3>
              <div className="space-y-4">
                {mockEducatorCourses.map((course) => (
                  <Card key={course.id} className="border-4 border-foreground shadow-brutal">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg">{course.title}</h4>
                        <div className="flex gap-2">
                          <Badge className="bg-ugram-green text-white">
                            ⭐ {course.rating}
                          </Badge>
                          <Badge variant="outline" className="border-foreground">
                            {course.students} students
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-ugram-blue">{course.enrollments}</p>
                          <p className="text-xs text-muted-foreground">Enrollments</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-ugram-green">${course.revenue}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-ugram-yellow">{course.rating}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;