-- CreateTable
CREATE TABLE "user_data" (
    "user_id" TEXT NOT NULL,
    "user_age" INTEGER NOT NULL,
    "user_birth_date" TEXT NOT NULL,
    "user_created_at" TEXT NOT NULL,
    "user_display_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_gender" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_updated_at" TEXT NOT NULL,

    CONSTRAINT "user_data_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_data_user_email_key" ON "user_data"("user_email");
