export class VideoService {
  private rooms: Map<string, Map<string, any>> = new Map();
  private userSocketMap: Map<string, string> = new Map();

  async initialize() {
    console.log("Video service initialized with simple-peer");
  }

  canJoinRoom(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    return !room || room.size < 10; // Max 10 users per room
  }

  addUserToRoom(
    roomId: string,
    userId: string,
    socketId: string,
    userInfo?: any
  ) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
    }

    const room = this.rooms.get(roomId)!;
    room.set(socketId, {
      userId,
      socketId,
      joinedAt: new Date(),
      ...userInfo,
    });

    this.userSocketMap.set(userId, socketId);

    console.log(
      `User ${userId} (${socketId}) added to room ${roomId}. Total users: ${room.size}`
    );
  }

  removeUserFromRoom(roomId: string, socketId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      const user = room.get(socketId);
      if (user) {
        this.userSocketMap.delete(user.userId);
        room.delete(socketId);
        console.log(
          `User ${user.userId} (${socketId}) removed from room ${roomId}. Remaining users: ${room.size}`
        );

        // Clean up empty room
        if (room.size === 0) {
          this.rooms.delete(roomId);
          console.log(`Room ${roomId} cleaned up - no users remaining`);
        }
      }
    }
  }

  getRoomUsers(roomId: string): any[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room.values()) : [];
  }

  getUserBySocketId(socketId: string): any | null {
    for (const [roomId, room] of this.rooms) {
      const user = room.get(socketId);
      if (user) {
        return { ...user, roomId };
      }
    }
    return null;
  }

  getRoomBySocketId(socketId: string): string | null {
    for (const [roomId, room] of this.rooms) {
      if (room.has(socketId)) {
        return roomId;
      }
    }
    return null;
  }

  isUserInRoom(roomId: string, userId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    for (const user of room.values()) {
      if (user.userId === userId) {
        return true;
      }
    }
    return false;
  }

  getRoomStats(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { exists: false, userCount: 0, users: [] };
    }

    return {
      exists: true,
      userCount: room.size,
      users: Array.from(room.values()).map((user) => ({
        userId: user.userId,
        socketId: user.socketId,
        joinedAt: user.joinedAt,
      })),
    };
  }

  getAllRooms() {
    const roomsList: any[] = [];
    for (const [roomId, room] of this.rooms) {
      roomsList.push({
        roomId,
        userCount: room.size,
        users: Array.from(room.values()),
      });
    }
    return roomsList;
  }
}
