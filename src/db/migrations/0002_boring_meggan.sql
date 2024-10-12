ALTER TABLE "transaction_types" DROP CONSTRAINT "transaction_types_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "budget_categories" ALTER COLUMN "budget_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "budget_category_items" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "budget_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction_types" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN IF EXISTS "user_id";