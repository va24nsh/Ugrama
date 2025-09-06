import { Socket } from "socket.io";
import { VideoService } from "../services/video.services";

export class VideoController {
  private videoService: VideoService;

  constructor(videoService: VideoService) {
    this.videoService = videoService;
  }

  async handleJoinRoom(
    socket: Socket,
    roomId: string,
    userId: string,
    userInfo?: any
  ) {
    try {
      // Check if user can join room
      if (!this.videoService.canJoinRoom(roomId)) {
        socket.emit("error", { message: "Room is full (max 10 users)" });
        return;
      }

      // Check if user is already in this room
      if (this.videoService.isUserInRoom(roomId, userId)) {
        socket.emit("error", { message: "User already in this room" });
        return;
      }

      // Add user to room
      this.videoService.addUserToRoom(roomId, userId, socket.id, userInfo);

      // Store room info on socket
      socket.data.roomId = roomId;
      socket.data.userId = userId;

      // Join socket room
      socket.join(roomId);

      // Get existing users in room (exclude current user)
      const existingUsers = this.videoService
        .getRoomUsers(roomId)
        .filter((user) => user.socketId !== socket.id);

      // Send existing users to new user
      socket.emit("existing-users", {
        users: existingUsers.map((user) => ({
          userId: user.userId,
          socketId: user.socketId,
        })),
      });

      // Notify existing users about new user
      socket.to(roomId).emit("user-joined", {
        userId,
        socketId: socket.id,
        userInfo,
      });

      // Send room stats to user
      const roomStats = this.videoService.getRoomStats(roomId);
      socket.emit("room-joined", {
        roomId,
        ...roomStats,
        yourSocketId: socket.id,
      });

      console.log(
        `User ${userId} joined room ${roomId}. Room now has ${roomStats.userCount} users.`
      );
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  }

  async handleLeaveRoom(socket: Socket) {
    try {
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;

      if (roomId && userId) {
        // Leave socket room
        socket.leave(roomId);

        // Remove from video service
        this.videoService.removeUserFromRoom(roomId, socket.id);

        // Notify other users
        socket.to(roomId).emit("user-left", {
          userId,
          socketId: socket.id,
        });

        // Clear socket data
        delete socket.data.roomId;
        delete socket.data.userId;

        socket.emit("room-left", { roomId });
        console.log(`User ${userId} left room ${roomId}`);
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  }

  // Handle WebRTC signaling for simple-peer
  async handleSignal(
    socket: Socket,
    data: { to: string; signal: any; from?: string }
  ) {
    try {
      const { to, signal, from } = data;
      const fromSocketId = from || socket.id;
      const roomId = socket.data.roomId;

      if (!roomId) {
        socket.emit("error", { message: "Not in a room" });
        return;
      }

      // Forward signal to target peer
      socket.to(to).emit("signal", {
        signal,
        from: fromSocketId,
        roomId,
      });

      console.log(
        `Signal forwarded from ${fromSocketId} to ${to} in room ${roomId}`
      );
    } catch (error) {
      console.error("Error handling signal:", error);
      socket.emit("error", { message: "Failed to send signal" });
    }
  }

  // Handle call initiation
  async handleCallUser(
    socket: Socket,
    data: { to: string; signalData: any; userInfo?: any }
  ) {
    try {
      const { to, signalData, userInfo } = data;
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;

      if (!roomId) {
        socket.emit("error", { message: "Not in a room" });
        return;
      }

      socket.to(to).emit("incoming-call", {
        signal: signalData,
        from: socket.id,
        fromUserId: userId,
        userInfo,
        roomId,
      });

      console.log(
        `Call initiated from ${socket.id} to ${to} in room ${roomId}`
      );
    } catch (error) {
      console.error("Error handling call:", error);
      socket.emit("error", { message: "Failed to initiate call" });
    }
  }

  // Handle call acceptance
  async handleAcceptCall(socket: Socket, data: { to: string; signal: any }) {
    try {
      const { to, signal } = data;
      const roomId = socket.data.roomId;

      if (!roomId) {
        socket.emit("error", { message: "Not in a room" });
        return;
      }

      socket.to(to).emit("call-accepted", {
        signal,
        from: socket.id,
      });

      console.log(`Call accepted by ${socket.id} to ${to} in room ${roomId}`);
    } catch (error) {
      console.error("Error accepting call:", error);
      socket.emit("error", { message: "Failed to accept call" });
    }
  }

  // Handle call rejection
  async handleRejectCall(
    socket: Socket,
    data: { to: string; reason?: string }
  ) {
    try {
      const { to, reason } = data;
      const roomId = socket.data.roomId;

      if (!roomId) {
        socket.emit("error", { message: "Not in a room" });
        return;
      }

      socket.to(to).emit("call-rejected", {
        from: socket.id,
        reason: reason || "Call rejected",
      });

      console.log(`Call rejected by ${socket.id} to ${to}: ${reason}`);
    } catch (error) {
      console.error("Error rejecting call:", error);
    }
  }

  // Handle disconnect
  async handleDisconnect(socket: Socket) {
    try {
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;

      if (roomId && userId) {
        // Remove from room
        this.videoService.removeUserFromRoom(roomId, socket.id);

        // Notify other users
        socket.to(roomId).emit("user-disconnected", {
          userId,
          socketId: socket.id,
        });

        console.log(`User ${userId} disconnected from room ${roomId}`);
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }

  // Get room information
  async handleGetRoomInfo(socket: Socket, roomId?: string) {
    try {
      const targetRoomId = roomId || socket.data.roomId;

      if (!targetRoomId) {
        socket.emit("error", { message: "No room specified" });
        return;
      }

      const roomStats = this.videoService.getRoomStats(targetRoomId);
      socket.emit("room-info", roomStats);
    } catch (error) {
      console.error("Error getting room info:", error);
      socket.emit("error", { message: "Failed to get room info" });
    }
  }

  // Mute/unmute user
  async handleToggleMute(
    socket: Socket,
    data: { muted: boolean; type: "audio" | "video" }
  ) {
    try {
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;

      if (!roomId) {
        socket.emit("error", { message: "Not in a room" });
        return;
      }

      // Broadcast mute status to other users
      socket.to(roomId).emit("user-mute-changed", {
        userId,
        socketId: socket.id,
        muted: data.muted,
        type: data.type,
      });

      console.log(
        `User ${userId} ${data.muted ? "muted" : "unmuted"} ${data.type}`
      );
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  }
}
