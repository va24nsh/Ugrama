import { Server } from "socket.io";
import { VideoService } from "../services/video.services";
import { VideoController } from "../controllers/video.controller";

export function setupVideoRoutes(io: Server) {
  const videoService = new VideoService();
  const videoController = new VideoController(videoService);

  // Initialize video service
  videoService.initialize().catch((error) => {
    console.error("Failed to initialize video service:", error);
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Room management
    socket.on(
      "join-room",
      async (data: { roomId: string; userInfo?: any }) => {
        console.log(`Join room request: ${data.roomId}`);
        await videoController.handleJoinRoom(
          socket,
          data.roomId,
          data.userInfo
        );
      }
    );

    socket.on("leave-room", async () => {
      await videoController.handleLeaveRoom(socket);
    });

    socket.on("get-room-info", async (data?: { roomId?: string }) => {
      await videoController.handleGetRoomInfo(socket, data?.roomId);
    });

    // WebRTC signaling for simple-peer
    socket.on(
      "signal",
      async (data: { to: string; signal: any; from?: string }) => {
        await videoController.handleSignal(socket, data);
      }
    );

    // Call management
    socket.on(
      "call-user",
      async (data: { to: string; signalData: any; userInfo?: any }) => {
        await videoController.handleCallUser(socket, data);
      }
    );

    socket.on("accept-call", async (data: { to: string; signal: any }) => {
      await videoController.handleAcceptCall(socket, data);
    });

    socket.on("reject-call", async (data: { to: string; reason?: string }) => {
      await videoController.handleRejectCall(socket, data);
    });

    // Media controls
    socket.on(
      "toggle-mute",
      async (data: { muted: boolean; type: "audio" | "video" }) => {
        await videoController.handleToggleMute(socket, data);
      }
    );

    // Screen sharing
    socket.on("start-screen-share", (data: { to?: string }) => {
      const roomId = socket.data.roomId;
      if (roomId) {
        if (data.to) {
          socket.to(data.to).emit("screen-share-started", {
            from: socket.id,
            userId: socket.data.userId,
          });
        } else {
          socket.to(roomId).emit("screen-share-started", {
            from: socket.id,
            userId: socket.data.userId,
          });
        }
      }
    });

    socket.on("stop-screen-share", (data: { to?: string }) => {
      const roomId = socket.data.roomId;
      if (roomId) {
        if (data.to) {
          socket.to(data.to).emit("screen-share-stopped", {
            from: socket.id,
            userId: socket.data.userId,
          });
        } else {
          socket.to(roomId).emit("screen-share-stopped", {
            from: socket.id,
            userId: socket.data.userId,
          });
        }
      }
    });

    // Chat messages
    socket.on("send-message", (data: { message: string; timestamp?: Date }) => {
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;

      if (roomId) {
        const messageData = {
          message: data.message,
          from: socket.id,
          userId,
          timestamp: data.timestamp || new Date(),
          roomId,
        };

        // Send to all users in room including sender
        io.to(roomId).emit("message-received", messageData);
        console.log(
          `Message sent in room ${roomId} by ${userId}: ${data.message}`
        );
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      await videoController.handleDisconnect(socket);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Heartbeat/ping for connection health
    socket.on("ping", () => {
      socket.emit("pong");
    });
  });
}
