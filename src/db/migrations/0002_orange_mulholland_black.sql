ALTER TABLE "budget_categories" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "budget_category_items" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction_types" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "user_id" SET NOT NULL;