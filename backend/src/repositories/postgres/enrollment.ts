import { prisma } from "../../config/databases";
import { EnrollmentStatus, PaymentStatus } from "@prisma/client";

export class EnrollmentRepository {
  static async createEnrollment(data: {
    studentId: string;
    courseId: string;
    status?: EnrollmentStatus;
  }) {
    return await prisma.enrollment.create({
      data,
      include: {
        student: true,
        course: true,
      },
    });
  }

  static async getEnrollment(id: string) {
    return await prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: {
          include: {
            educator: {
              include: {
                user: true,
              },
            },
          },
        },
        payment: true,
        progress: true,
      },
    });
  }

  static async updateEnrollmentStatus(id: string, status: EnrollmentStatus) {
    return await prisma.enrollment.update({
      where: { id },
      data: {
        status,
        completedAt:
          status === EnrollmentStatus.COMPLETED ? new Date() : undefined,
      },
    });
  }

  static async getStudentEnrollments(studentId: string) {
    return await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: true,
        payment: true,
      },
    });
  }

  static async trackLessonProgress(data: {
    enrollmentId: string;
    lessonId: string;
    completed: boolean;
  }) {
    const { enrollmentId, lessonId, completed } = data;

    return await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        enrollmentId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });
  }
}
