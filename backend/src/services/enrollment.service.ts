import { EnrollmentRepository } from "../repositories/postgres/enrollment";
import { ProfileRepository } from "../repositories/postgres/profile";
import { CourseRepository } from "../repositories/postgres/course";
import { EnrollmentStatus } from "@prisma/client";

export class EnrollmentService {
  static async enrollInCourse(userId: string, courseId: string) {
    // Check if student profile exists
    const studentProfile = await ProfileRepository.getStudentProfile(userId);
    if (!studentProfile) {
      throw new Error(
        "Student profile not found. Create a student profile first."
      );
    }

    // Verify course exists and is published
    const course = await CourseRepository.getCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    if (!course.published) {
      throw new Error("This course is not available for enrollment yet");
    }

    // Create enrollment
    const enrollment = await EnrollmentRepository.createEnrollment({
      studentId: studentProfile.id,
      courseId: course.id,
    });

    // In a real application, you'd handle payment processing here
    // For free courses or courses with delayed payment, you might skip this step

    return enrollment;
  }

  static async getEnrollment(enrollmentId: string) {
    const enrollment = await EnrollmentRepository.getEnrollment(enrollmentId);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    return enrollment;
  }

  static async trackProgress(
    enrollmentId: string,
    lessonId: string,
    completed: boolean
  ) {
    return await EnrollmentRepository.trackLessonProgress({
      enrollmentId,
      lessonId,
      completed,
    });
  }

  static async completeEnrollment(enrollmentId: string) {
    return await EnrollmentRepository.updateEnrollmentStatus(
      enrollmentId,
      EnrollmentStatus.COMPLETED
    );
  }

  static async getStudentEnrollments(userId: string) {
    const studentProfile = await ProfileRepository.getStudentProfile(userId);
    if (!studentProfile) {
      throw new Error("Student profile not found");
    }

    return await EnrollmentRepository.getStudentEnrollments(studentProfile.id);
  }
}
