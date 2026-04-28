/*
  Warnings:

  - You are about to drop the column `completed` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "completed",
ADD COLUMN     "situation" "situation" NOT NULL DEFAULT 'TO_DO';
