-- CreateTable
CREATE TABLE "recurring_expense" (
    "recurring_expense_id" TEXT NOT NULL,
    "recurring_expense_title" TEXT NOT NULL,
    "recurring_expense_category" TEXT NOT NULL,
    "recurring_expense_account_id" TEXT NOT NULL,
    "recurring_expense_amount" DOUBLE PRECISION NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "recurring_expense_pkey" PRIMARY KEY ("recurring_expense_id")
);

-- AddForeignKey
ALTER TABLE "recurring_expense" ADD CONSTRAINT "recurring_expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_data"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
