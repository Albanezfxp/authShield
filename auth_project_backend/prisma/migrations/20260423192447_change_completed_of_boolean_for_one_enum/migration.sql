/*
  Warnings:

  - The `completed` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Situation" AS ENUM ('TO_DO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "completed",
ADD COLUMN     "completed" "Situation" NOT NULL DEFAULT 'TO_DO';
