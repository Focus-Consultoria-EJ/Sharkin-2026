/*
  Warnings:

  - You are about to drop the column `date` on the `duties` table. All the data in the column will be lost.
  - You are about to drop the column `in_time` on the `duties` table. All the data in the column will be lost.
  - You are about to drop the column `out_time` on the `duties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "duties" DROP COLUMN "date",
DROP COLUMN "in_time",
DROP COLUMN "out_time",
ADD COLUMN     "dateTime_in" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateTime_out" TIMESTAMP(3);
