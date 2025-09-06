import { prisma } from "../../config/databases";
import { Level } from "@prisma/client";

export class CourseRepository {
  static async createCourse(data: {
    title: string;
    description: string;
    price: number;
    duration: number;
    level: Level;
    thumbnail?: string;
    category: string;
    educatorId: string;
    published?: boolean;
  }) {
    return await prisma.course.create({
      data,
      include: {
        educator: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  static async getCourseById(id: string) {
    return await prisma.course.findUnique({
      where: { id },
      include: {
        educator: {
          include: {
            user: true,
          },
        },
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  static async updateCourse(
    id: string,
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
    return await prisma.course.update({
      where: { id },
      data,
    });
  }

  static async deleteCourse(id: string) {
    return await prisma.course.delete({
      where: { id },
    });
  }

  static async listCourses(filters?: {
    category?: string;
    level?: Level;
    educatorId?: string;
    published?: boolean;
    priceMin?: number;
    priceMax?: number;
  }) {
    const where: any = {};

    if (filters?.category) where.category = filters.category;
    if (filters?.level) where.level = filters.level;
    if (filters?.educatorId) where.educatorId = filters.educatorId;
    if (filters?.published !== undefined) where.published = filters.published;
    if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
      where.price = {};
      if (filters?.priceMin !== undefined) where.price.gte = filters.priceMin;
      if (filters?.priceMax !== undefined) where.price.lte = filters.priceMax;
    }

    return await prisma.course.findMany({
      where,
      include: {
        educator: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
