/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CartItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CHECKED_OUT');

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");
