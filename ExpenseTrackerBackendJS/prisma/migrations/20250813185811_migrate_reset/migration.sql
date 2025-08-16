/*
  Warnings:

  - The primary key for the `account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accountBalance` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `accountName` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `accountStatus` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyIncome` on the `account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_name]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_balance` to the `account` table without a default value. This is not possible if the table is not empty.
  - The required column `account_id` was added to the `account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `account_name` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_status` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthly_income` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "account_accountName_key";

-- AlterTable
ALTER TABLE "account" DROP CONSTRAINT "account_pkey",
DROP COLUMN "accountBalance",
DROP COLUMN "accountId",
DROP COLUMN "accountName",
DROP COLUMN "accountStatus",
DROP COLUMN "monthlyIncome",
ADD COLUMN     "account_balance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "account_name" TEXT NOT NULL,
ADD COLUMN     "account_status" TEXT NOT NULL,
ADD COLUMN     "monthly_income" DOUBLE PRECISION NOT NULL,
ADD CONSTRAINT "account_pkey" PRIMARY KEY ("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_account_name_key" ON "account"("account_name");
