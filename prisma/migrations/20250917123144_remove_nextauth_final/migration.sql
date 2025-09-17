-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';
