import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Pause, 
  Users, 
  Trophy, 
  Clock, 
  BookOpen, 
  Video,
  MessageSquare,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Settings,
  Timer,
  Save
} from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

const CourseModule = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(1800); // 30 minutes
  const [isEdVerseActive, setIsEdVerseActive] = useState(false);
  const [notes, setNotes] = useState("");
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  // Mock data
  const courseProgress = 65;
  const currentLesson = "Building REST APIs with Node.js";
  const totalLessons = 48;
  const completedLessons = 31;

  const leaderboard = [
    { id: "1", name: "Emma Chen", points: 2450, avatar: "👩‍💻" },
    { id: "2", name: "Alex Rodriguez", points: 2380, avatar: "👨‍💼" },
    { id: "3", name: "Sarah Johnson", points: 2210, avatar: "👩‍🎨" },
    { id: "4", name: "You", points: 1980, avatar: "🙂" },
    { id: "5", name: "Mike Wilson", points: 1850, avatar: "👨‍🚀" },
  ];

  const studyRoomUsers: User[] = [
    { id: "1", name: "Emma", avatar: "👩‍💻" },
    { id: "2", name: "Alex", avatar: "👨‍💼" },
    { id: "3", name: "Sarah", avatar: "👩‍🎨" },
  ];

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsPomodoroActive(false);
      // Reset to 25 minutes for next session
      setPomodoroTime(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isPomodoroActive, pomodoroTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCreateStudyRoom = () => {
    setIsEdVerseActive(true);
  };

  const handleEndStudyRoom = () => {
    setIsEdVerseActive(false);
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`notes_${currentLesson}`, notes);
    // Toast would be shown here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <div className="bg-card border-b-4 border-foreground p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black text-foreground">Full-Stack Web Development</h1>
            <Badge className="bg-ugram-green text-white">
              Lesson {completedLessons + 1} of {totalLessons}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">{currentLesson}</span>
              <span>{courseProgress}% Complete</span>
            </div>
            <Progress value={courseProgress} className="h-3" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Video and Content Area - Spans 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          <Card className="border-4 border-foreground shadow-brutal">
            <CardContent className="p-0">
              <div className="relative bg-black aspect-video rounded-t-lg overflow-hidden">
                {/* Mock Video Player */}
                <div className="absolute inset-0 bg-gradient-to-br from-ugram-blue to-ugram-purple flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-semibold">Building REST APIs with Node.js</p>
                    <p className="text-sm opacity-80">Duration: {formatTime(duration)}</p>
                  </div>
                </div>
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-4 text-white">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <div className="flex-1">
                      <div className="bg-white/30 h-1 rounded-full">
                        <div 
                          className="bg-white h-1 rounded-full transition-all"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!isEdVerseActive ? (
              <Button
                variant="brutal"
                size="lg"
                onClick={handleCreateStudyRoom}
                className="bg-ugram-purple text-white flex-1"
              >
                <Users className="h-5 w-5 mr-2" />
                Create Classroom Environment 🎓
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={handleEndStudyRoom}
                className="border-2 border-foreground flex-1"
              >
                End Study Session 👋
              </Button>
            )}
          </div>

          {/* Ed-Verse Study Environment */}
          {isEdVerseActive && (
            <Card className="border-4 border-foreground shadow-brutal bg-gradient-accent">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Ed-Verse Study Room
                  </span>
                  {/* Pomodoro Timer */}
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border-2 border-foreground">
                    <Timer className="h-4 w-4" />
                    <span className="font-mono font-bold">{formatTime(pomodoroTime)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPomodoroActive(!isPomodoroActive)}
                      className="h-6 w-6 p-0"
                    >
                      {isPomodoroActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Study Room Participants */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {studyRoomUsers.map((user) => (
                    <div key={user.id} className="bg-card p-3 rounded-lg border-2 border-foreground text-center">
                      <div className="text-2xl mb-2">{user.avatar}</div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Studying</p>
                    </div>
                  ))}
                </div>

                {/* Video Call Controls */}
                <div className="flex justify-center gap-4 p-4 bg-card rounded-lg border-2 border-foreground">
                  <Button
                    variant={isMicOn ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className="border-2 border-foreground"
                  >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isCameraOn ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    className="border-2 border-foreground"
                  >
                    {isCameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" className="border-2 border-foreground">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-2 border-foreground">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes Section */}
          <Card className="border-4 border-foreground shadow-brutal">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lecture Notes
                </span>
                <Button variant="outline" size="sm" onClick={handleSaveNotes}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes during the lecture..."
                className="min-h-[200px] border-2 border-foreground resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Spans 1 column */}
        <div className="space-y-6">
          {/* Course Timeline */}
          <Card className="border-4 border-foreground shadow-brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Course Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={`p-3 rounded-lg border-2 ${
                  i === 2 ? 'border-primary bg-primary/10' : 'border-muted bg-muted'
                }`}>
                  <p className="font-semibold text-sm">Lesson {31 + i}</p>
                  <p className="text-xs text-muted-foreground">
                    {i === 2 ? 'Current: REST APIs' : `Topic ${31 + i}`}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="border-4 border-foreground shadow-brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-ugram-yellow" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user, index) => (
                <div key={user.id} className={`flex items-center gap-3 p-2 rounded-lg ${
                  user.name === "You" ? 'bg-ugram-purple border-2 border-foreground' : ''
                }`}>
                  <span className="font-bold text-lg">{index + 1}</span>
                  <span className="text-xl">{user.avatar}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.points} pts</p>
                  </div>
                  {index < 3 && (
                    <div className="text-xs">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseModule;