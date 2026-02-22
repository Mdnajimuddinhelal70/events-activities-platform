/*
  Warnings:

  - You are about to drop the column `email` on the `admins` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CONCERT', 'HIKE', 'DINNER', 'SPORTS', 'TECH_MEETUP', 'OTHER');

-- DropIndex
DROP INDEX "admins_email_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "type",
ADD COLUMN     "type" "EventType" NOT NULL;

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");

-- CreateIndex
CREATE INDEX "Event_location_idx" ON "Event"("location");

-- CreateIndex
CREATE INDEX "Event_eventDate_idx" ON "Event"("eventDate");
