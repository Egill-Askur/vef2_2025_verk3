-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "desc" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "svar1" TEXT NOT NULL,
    "svar2" TEXT NOT NULL,
    "svar3" TEXT NOT NULL,
    "svar4" TEXT NOT NULL,
    "correctAnswer" INTEGER NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);
