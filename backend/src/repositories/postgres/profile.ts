import { prisma } from "../../config/databases";

export class ProfileRepository {
  static async createStudentProfile(data: {
    userId: string;
    interests: string[];
    skillLevel?: string;
    goals?: string;
  }) {
    return await prisma.studentProfile.create({
      data,
      include: {
        user: true,
      },
    });
  }

  static async createEducatorProfile(data: {
    userId: string;
    qualifications: string[];
    experience?: string;
    expertise: string[];
    website?: string;
  }) {
    return await prisma.educatorProfile.create({
      data,
      include: {
        user: true,
      },
    });
  }

  static async getStudentProfile(userId: string) {
    return await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  static async getEducatorProfile(userId: string) {
    return await prisma.educatorProfile.findUnique({
      where: { userId },
      include: {
        courses: true,
      },
    });
  }

  static async updateStudentProfile(
    userId: string,
    data: {
      interests?: string[];
      skillLevel?: string;
      goals?: string;
    }
  ) {
    return await prisma.studentProfile.update({
      where: { userId },
      data,
    });
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
    return await prisma.educatorProfile.update({
      where: { userId },
      data,
    });
  }
}
