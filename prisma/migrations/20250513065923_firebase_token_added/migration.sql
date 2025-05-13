/*
  Warnings:

  - A unique constraint covering the columns `[firebaseToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firebaseToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseToken_key" ON "User"("firebaseToken");
