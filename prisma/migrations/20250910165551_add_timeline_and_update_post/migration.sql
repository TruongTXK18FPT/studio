/*
  Warnings:

  - You are about to drop the column `published` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."posts" DROP COLUMN "published",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "tags" JSONB;

-- CreateTable
CREATE TABLE "public"."timelines" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "date" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "location" TEXT,
    "type" TEXT NOT NULL,
    "media" JSONB,
    "tags" JSONB,
    "content" TEXT,
    "sources" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timelines_pkey" PRIMARY KEY ("id")
);
