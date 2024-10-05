ALTER TABLE "transactions" DROP CONSTRAINT "transactions_item_id_budget_category_items_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "budget_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN IF EXISTS "item_id";