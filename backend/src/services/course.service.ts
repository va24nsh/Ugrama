import { CourseRepository } from "../repositories/postgres/course";
import { ProfileRepository } from "../repositories/postgres/profile";
import { Level } from "@prisma/client";

export class CourseService {
  static async createCourse(
    userId: string,
    data: {
      title: string;
      description: string;
      price: number;
      duration: number;
      level: Level;
      thumbnail?: string;
      category: string;
      published?: boolean;
    }
  ) {
    // Get educator profile
    const educatorProfile = await ProfileRepository.getEducatorProfile(userId);
    if (!educatorProfile) {
      throw new Error(
        "Educator profile not found. Create an educator profile first."
      );
    }

    return await CourseRepository.createCourse({
      ...data,
      educatorId: educatorProfile.id,
    });
  }

  static async getCourse(id: string) {
    const course = await CourseRepository.getCourseById(id);
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  }

  static async updateCourse(
    id: string,
    educatorId: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      duration?: number;
      level?: Level;
      thumbnail?: string;
      category?: string;
      published?: boolean;
    }
  ) {
    // Verify the course belongs to this educator
    const course = await CourseRepository.getCourseById(id);
    if (!course) {
      throw new Error("Course not found");
    }

    const educatorProfile = await ProfileRepository.getEducatorProfile(
      educatorId
    );
    if (!educatorProfile || course.educatorId !== educatorProfile.id) {
      throw new Error("You don't have permission to update this course");
    }

    return await CourseRepository.updateCourse(id, data);
  }

  static async deleteCourse(id: string, educatorId: string) {
    // Verify the course belongs to this educator
    const course = await CourseRepository.getCourseById(id);
    if (!course) {
      throw new Error("Course not found");
    }

    const educatorProfile = await ProfileRepository.getEducatorProfile(
      educatorId
    );
    if (!educatorProfile || course.educatorId !== educatorProfile.id) {
      throw new Error("You don't have permission to delete this course");
    }

    return await CourseRepository.deleteCourse(id);
  }

  static async listCourses(filters?: {
    category?: string;
    level?: Level;
    educatorId?: string;
    published?: boolean;
    priceMin?: number;
    priceMax?: number;
  }) {
    return await CourseRepository.listCourses(filters);
  }
}
