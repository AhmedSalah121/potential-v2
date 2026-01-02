-- Create sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq
START 10000
INCREMENT 1;

-- AlterTable
ALTER TABLE "Order"
ALTER COLUMN     "orderNumber" SET DEFAULT nextval('order_number_seq');

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx"
    ON "Order"("orderNumber");