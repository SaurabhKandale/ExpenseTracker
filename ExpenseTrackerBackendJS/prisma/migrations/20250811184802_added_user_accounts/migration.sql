-- CreateTable
CREATE TABLE "account" (
    "accountId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "monthlyIncome" DOUBLE PRECISION NOT NULL,
    "accountBalance" DOUBLE PRECISION NOT NULL,
    "accountStatus" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("accountId")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_accountName_key" ON "account"("accountName");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_data"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
