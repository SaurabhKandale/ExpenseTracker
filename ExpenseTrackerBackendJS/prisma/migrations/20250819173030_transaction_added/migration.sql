-- CreateTable
CREATE TABLE "transaction" (
    "transaction_id" TEXT NOT NULL,
    "transaction_amount" DOUBLE PRECISION NOT NULL,
    "transaction_category" TEXT NOT NULL,
    "transaction_description" TEXT NOT NULL,
    "transaction_date" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "account_id_to_which_money_transferred" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_transaction_id_key" ON "transaction"("transaction_id");
