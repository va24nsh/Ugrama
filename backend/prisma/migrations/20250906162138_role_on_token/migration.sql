/*
  Warnings:

  - Added the required column `role` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RefreshToken" ADD COLUMN     "role" "public"."Role" NOT NULL;
