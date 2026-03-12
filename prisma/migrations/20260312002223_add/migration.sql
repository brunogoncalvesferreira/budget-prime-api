-- AlterTable
ALTER TABLE "budgets" ADD COLUMN     "clientsId" TEXT,
ADD COLUMN     "usersId" TEXT,
ALTER COLUMN "pdf_url" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_clientsId_fkey" FOREIGN KEY ("clientsId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
