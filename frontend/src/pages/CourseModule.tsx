import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  Save,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  HelpCircle,
  Bookmark,
  X,
  Edit,
  Trash2,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Lesson {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
}

interface Doubt {
  id: string;
  timestamp: number;
  question: string;
  lessonId: string;
  lessonTitle: string;
  createdAt: Date;
}

const CourseModule = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEdVerseActive, setIsEdVerseActive] = useState(false);
  const [notes, setNotes] = useState("");
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  

  // Doubt feature states
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [currentDoubtQuestion, setCurrentDoubtQuestion] = useState("");
  const [doubtTimestamp, setDoubtTimestamp] = useState(0);
  const [editingDoubtId, setEditingDoubtId] = useState<string | null>(null);

  const playerRef = useRef<HTMLDivElement>(null);

  // Course lessons with YouTube videos
  const lessons: Lesson[] = [
    {
      id: "1",
      title: "Introduction to Node.js",
      youtubeId: "TlB_eWDSMt4",
      duration: 1800,
    },
    {
      id: "2",
      title: "Building REST APIs with Node.js",
      youtubeId: "pKd0Rpw7O48",
      duration: 2400,
    },
    {
      id: "3",
      title: "Express.js Fundamentals",
      youtubeId: "L72fhGm1tfE",
      duration: 2100,
    },
    {
      id: "4",
      title: "MongoDB Integration",
      youtubeId: "ExcRbA7fy_A",
      duration: 1950,
    },
    {
      id: "5",
      title: "Authentication & Security",
      youtubeId: "mbsmsi7l3r4",
      duration: 2700,
    },
  ];

  const currentLesson = lessons[currentLessonIndex];
  const courseProgress = Math.round(
    ((currentLessonIndex + 1) / lessons.length) * 100
  );
  const totalLessons = lessons.length;
  const completedLessons = currentLessonIndex;

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

  // Load doubts from localStorage on component mount
  useEffect(() => {
    const savedDoubts = localStorage.getItem("course_doubts");
    if (savedDoubts) {
      setDoubts(JSON.parse(savedDoubts));
    }
  }, []);

  // Save doubts to localStorage whenever doubts change
  useEffect(() => {
    localStorage.setItem("course_doubts", JSON.stringify(doubts));
  }, [doubts]);

  // Load YouTube API
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  const initializePlayer = () => {
    if (playerRef.current && (window as any).YT) {
      const newPlayer = new (window as any).YT.Player(playerRef.current, {
        height: "100%",
        width: "100%",
        videoId: currentLesson.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          autohide: 0,
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
            setPlayerReady(true);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event: any) => {
            const state = event.data;
            if (state === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (
              state === (window as any).YT.PlayerState.PAUSED ||
              state === (window as any).YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
          },
        },
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (player && isPlaying && playerReady) {
      interval = setInterval(() => {
        if (player.getCurrentTime) {
          setCurrentTime(player.getCurrentTime());
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, isPlaying, playerReady]);

  useEffect(() => {
    if (player && playerReady) {
      player.loadVideoById(currentLesson.youtubeId);
      setCurrentTime(0);
    }
  }, [currentLessonIndex, player, playerReady]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsPomodoroActive(false);
      setPomodoroTime(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isPomodoroActive, pomodoroTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (player && playerReady) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleSeek = (percentage: number) => {
    if (player && playerReady && duration) {
      const newTime = (percentage / 100) * duration;
      player.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleSkipForward = () => {
    if (player && playerReady) {
      const newTime = Math.min(currentTime + 10, duration);
      player.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleSkipBack = () => {
    if (player && playerReady) {
      const newTime = Math.max(currentTime - 10, 0);
      player.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleCreateStudyRoom = () => {
    setIsEdVerseActive(true);
  };

  const handleEndStudyRoom = () => {
    setIsEdVerseActive(false);
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`notes_${currentLesson.title}`, notes);
  };

  // Doubt functionality
  const handleCreateDoubt = () => {
    if (player && playerReady) {
      // Pause the video when creating a doubt
      if (isPlaying) {
        player.pauseVideo();
      }
      setDoubtTimestamp(currentTime);
      setShowDoubtModal(true);
    }
  };

  const handleSaveDoubt = () => {
    if (currentDoubtQuestion.trim()) {
      const newDoubt: Doubt = {
        id: editingDoubtId || Date.now().toString(),
        timestamp: doubtTimestamp,
        question: currentDoubtQuestion,
        lessonId: currentLesson.id,
        lessonTitle: currentLesson.title,
        createdAt: new Date(),
      };

      if (editingDoubtId) {
        setDoubts(
          doubts.map((doubt) =>
            doubt.id === editingDoubtId ? newDoubt : doubt
          )
        );
        setEditingDoubtId(null);
      } else {
        setDoubts([...doubts, newDoubt]);
      }

      setCurrentDoubtQuestion("");
      setShowDoubtModal(false);
    }
  };

  const handleEditDoubt = (doubt: Doubt) => {
    setEditingDoubtId(doubt.id);
    setCurrentDoubtQuestion(doubt.question);
    setDoubtTimestamp(doubt.timestamp);
    setShowDoubtModal(true);
  };

  const handleDeleteDoubt = (doubtId: string) => {
    setDoubts(doubts.filter((doubt) => doubt.id !== doubtId));
  };

  const handleJumpToDoubt = (doubt: Doubt) => {
    // Switch to the lesson if it's different
    const lessonIndex = lessons.findIndex(
      (lesson) => lesson.id === doubt.lessonId
    );
    if (lessonIndex !== -1 && lessonIndex !== currentLessonIndex) {
      setCurrentLessonIndex(lessonIndex);
    }

    // Jump to timestamp after a small delay to ensure video is loaded
    setTimeout(() => {
      if (player && playerReady) {
        player.seekTo(doubt.timestamp);
        setCurrentTime(doubt.timestamp);
      }
    }, 1000);
  };

  const handleCancelDoubt = () => {
    setShowDoubtModal(false);
    setCurrentDoubtQuestion("");
    setEditingDoubtId(null);
  };

  const getCurrentLessonDoubts = () => {
    return doubts.filter((doubt) => doubt.lessonId === currentLesson.id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <div className="bg-card border-b-4 border-foreground p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black text-foreground">
              Full-Stack Web Development
            </h1>
            <Badge className="bg-ugram-green text-white">
              Lesson {completedLessons + 1} of {totalLessons}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">{currentLesson.title}</span>
              <span>{courseProgress}% Complete</span>
            </div>
            <Progress value={courseProgress} className="h-3" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Video and Content Area - Spans 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* YouTube Video Player */}
          <Card className="border-4 border-foreground shadow-brutal">
            <CardContent className="p-0">
              <div className="relative bg-black aspect-video rounded-t-lg overflow-hidden">
                {/* YouTube Player Container */}
                <div ref={playerRef} className="w-full h-full" />

                {/* Custom Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 text-white text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <div
                        className="flex-1 bg-white/30 h-1 rounded-full cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percentage =
                            ((e.clientX - rect.left) / rect.width) * 100;
                          handleSeek(percentage);
                        }}
                      >
                        <div
                          className="bg-ugram-green h-1 rounded-full transition-all"
                          style={{
                            width: duration
                              ? `${(currentTime / duration) * 100}%`
                              : "0%",
                          }}
                        />
                        {/* Doubt markers on progress bar */}
                        {getCurrentLessonDoubts().map((doubt) => (
                          <div
                            key={doubt.id}
                            className="absolute top-0 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/2 cursor-pointer"
                            style={{
                              left: `${(doubt.timestamp / duration) * 100}%`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJumpToDoubt(doubt);
                            }}
                            title={`Doubt: ${doubt.question}`}
                          />
                        ))}
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSkipBack}
                          className="text-white hover:bg-white/20"
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePlayPause}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSkipForward}
                          className="text-white hover:bg-white/20"
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePreviousLesson}
                          disabled={currentLessonIndex === 0}
                          className="text-white hover:bg-white/20 disabled:opacity-50"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleNextLesson}
                          disabled={currentLessonIndex === lessons.length - 1}
                          className="text-white hover:bg-white/20 disabled:opacity-50"
                        >
                          Next
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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

            {/* Add Doubt Button */}
            <Button
              variant="brutal"
              size="lg"
              onClick={handleCreateDoubt}
              className="bg-red-500 text-white"
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Add Doubt 🤔
            </Button>
          </div>

          {/* Doubt Modal */}
          {showDoubtModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4 border-4 border-foreground shadow-brutal">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      {editingDoubtId ? "Edit Doubt" : "Add Doubt"} at{" "}
                      {formatTime(doubtTimestamp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelDoubt}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      What's your doubt or question?
                    </label>
                    <Textarea
                      value={currentDoubtQuestion}
                      onChange={(e) => setCurrentDoubtQuestion(e.target.value)}
                      placeholder="Describe your doubt or question about this part of the video..."
                      className="min-h-[100px] border-2 border-foreground"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelDoubt}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="brutal"
                      onClick={handleSaveDoubt}
                      className="flex-1 bg-ugram-green text-white"
                      disabled={!currentDoubtQuestion.trim()}
                    >
                      {editingDoubtId ? "Update" : "Save"} Doubt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ed-Verse Study Environment */}
          {isEdVerseActive && (
            <Card className="border-4 border-foreground shadow-brutal bg-gradient-accent">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Ed-Verse Study Room
                  </span>
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border-2 border-foreground">
                    <Timer className="h-4 w-4" />
                    <span className="font-mono font-bold">
                      {formatTime(pomodoroTime)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPomodoroActive(!isPomodoroActive)}
                      className="h-6 w-6 p-0"
                    >
                      {isPomodoroActive ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {studyRoomUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-card p-3 rounded-lg border-2 border-foreground text-center"
                    >
                      <div className="text-2xl mb-2">{user.avatar}</div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Studying</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 p-4 bg-card rounded-lg border-2 border-foreground">
                  <Button
                    variant={isMicOn ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className="border-2 border-foreground"
                  >
                    {isMicOn ? (
                      <Mic className="h-4 w-4" />
                    ) : (
                      <MicOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant={isCameraOn ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    className="border-2 border-foreground"
                  >
                    {isCameraOn ? (
                      <Camera className="h-4 w-4" />
                    ) : (
                      <CameraOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-foreground"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-foreground"
                  >
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
          {/* My Doubts Section */}
          <Card className="border-4 border-foreground shadow-brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-red-500" />
                My Doubts ({doubts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto">
              {doubts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No doubts yet. Click "Add Doubt" while watching to save your
                  questions!
                </p>
              ) : (
                doubts.map((doubt) => (
                  <div
                    key={doubt.id}
                    className="p-3 rounded-lg border-2 border-muted bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-xs text-muted-foreground">
                          {doubt.lessonTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          at {formatTime(doubt.timestamp)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDoubt(doubt)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDoubt(doubt.id)}
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{doubt.question}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJumpToDoubt(doubt)}
                      className="text-xs"
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      Jump to timestamp
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Course Timeline */}
          <Card className="border-4 border-foreground shadow-brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Course Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lessons.map((lesson, i) => {
                const lessonDoubts = doubts.filter(
                  (doubt) => doubt.lessonId === lesson.id
                );
                return (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      i === currentLessonIndex
                        ? "border-primary bg-primary/10"
                        : "border-muted bg-muted hover:border-primary/50"
                    }`}
                    onClick={() => setCurrentLessonIndex(i)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {i === currentLessonIndex
                            ? "Currently Playing"
                            : `Lesson ${i + 1}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Duration: {formatTime(lesson.duration)}
                        </p>
                      </div>
                      {lessonDoubts.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {lessonDoubts.length} doubt
                          {lessonDoubts.length !== 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
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
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    user.name === "You"
                      ? "bg-ugram-purple border-2 border-foreground"
                      : ""
                  }`}
                >
                  <span className="font-bold text-lg">{index + 1}</span>
                  <span className="text-xl">{user.avatar}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.points} pts
                    </p>
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
