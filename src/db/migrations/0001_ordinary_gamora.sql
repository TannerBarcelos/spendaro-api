ALTER TABLE "budget_categories" DROP CONSTRAINT "budget_categories_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "budget_category_items" DROP CONSTRAINT "budget_category_items_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "budget_categories" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "budget_category_items" DROP COLUMN IF EXISTS "user_id";