import { ProfileRepository } from "../repositories/postgres/profile";
import { UserRepository } from "../repositories/postgres/user";
import { Role } from "@prisma/client";

export class ProfileService {
  static async createStudentProfile(
    userId: string,
    data: {
      interests: string[];
      skillLevel?: string;
      goals?: string;
    }
  ) {
    // First, verify the user exists and has the STUDENT role
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== Role.STUDENT) {
      // Update user role if needed
      await UserRepository.updateUser(userId, { role: Role.STUDENT });
    }

    return await ProfileRepository.createStudentProfile({
      userId,
      ...data,
    });
  }

  static async createEducatorProfile(
    userId: string,
    data: {
      qualifications: string[];
      experience?: string;
      expertise: string[];
      website?: string;
    }
  ) {
    // First, verify the user exists and update to EDUCATOR role
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== Role.EDUCATOR) {
      // Update user role
      await UserRepository.updateUser(userId, { role: Role.EDUCATOR });
    }

    return await ProfileRepository.createEducatorProfile({
      userId,
      ...data,
    });
  }

  static async getProfile(userId: string) {
    const user = await UserRepository.findWithProfiles(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async updateStudentProfile(
    userId: string,
    data: {
      interests?: string[];
      skillLevel?: string;
      goals?: string;
    }
  ) {
    return await ProfileRepository.updateStudentProfile(userId, data);
  }

  static async updateEducatorProfile(
    userId: string,
    data: {
      qualifications?: string[];
      experience?: string;
      expertise?: string[];
      website?: string;
    }
  ) {
    return await ProfileRepository.updateEducatorProfile(userId, data);
  }
}
