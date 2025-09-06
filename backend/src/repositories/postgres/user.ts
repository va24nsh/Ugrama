import { prisma } from "../../config/databases";
import { AuthType, Role, User } from "@prisma/client";

export class UserRepository {
  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async findByGoogleId(googleId: string) {
    return await prisma.user.findUnique({
      where: { googleId },
    });
  }

  static async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    googleId?: string;
    avatar?: string;
    password?: string;
    role?: Role;
    authType?: AuthType;
    emailVerified?: boolean;
  }) {
    return await prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        googleId: userData.googleId,
        avatar: userData.avatar,
        password: userData.password,
        role: userData.role || Role.STUDENT,
        authType: userData.authType || AuthType.EMAIL,
        emailVerified:
          userData.authType === AuthType.GOOGLE
            ? true
            : userData.emailVerified || false,
      },
    });
  }

  static async updateUser(userId: string, updates: Partial<User>) {
    return await prisma.user.update({
      where: { id: userId },
      data: updates,
    });
  }

  static async deleteUser(userId: string) {
    return await prisma.user.delete({
      where: { id: userId },
    });
  }

  static async findWithProfiles(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        educatorProfile: true,
      },
    });
  }
}
