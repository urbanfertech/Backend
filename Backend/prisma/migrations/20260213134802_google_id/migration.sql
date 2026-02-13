/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "googleId" TEXT,
ALTER COLUMN "phone" DROP DEFAULT,
ALTER COLUMN "city" DROP DEFAULT,
ALTER COLUMN "pincode" DROP DEFAULT,
ALTER COLUMN "latitude" DROP DEFAULT,
ALTER COLUMN "longitude" DROP DEFAULT,
ALTER COLUMN "password" DROP DEFAULT,
ALTER COLUMN "photo" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
