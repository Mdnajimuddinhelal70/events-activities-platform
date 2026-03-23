/*
  Warnings:

  - The `status` column on the `event_participants` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_HostToPayment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_HostToPayment" DROP CONSTRAINT "_HostToPayment_A_fkey";

-- DropForeignKey
ALTER TABLE "_HostToPayment" DROP CONSTRAINT "_HostToPayment_B_fkey";

-- DropIndex
DROP INDEX "Payment_participantId_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "hostId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "event_participants" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "_HostToPayment";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "hosts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
