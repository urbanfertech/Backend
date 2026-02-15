-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'GROOMER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
