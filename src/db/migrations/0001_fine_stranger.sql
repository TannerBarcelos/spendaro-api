ALTER TABLE "budget_categories" DROP CONSTRAINT "budget_categories_budget_id_budgets_id_fk";
--> statement-breakpoint
ALTER TABLE "budget_category_item_transactions" DROP CONSTRAINT "budget_category_item_transactions_item_id_budget_category_items_id_fk";
--> statement-breakpoint
ALTER TABLE "budget_category_item_transactions" DROP CONSTRAINT "budget_category_item_transactions_transaction_type_id_budget_category_item_transaction_types_id_fk";
--> statement-breakpoint
ALTER TABLE "budget_category_items" DROP CONSTRAINT "budget_category_items_category_id_budget_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget_categories" ADD CONSTRAINT "budget_categories_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget_category_item_transactions" ADD CONSTRAINT "budget_category_item_transactions_item_id_budget_category_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."budget_category_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget_category_item_transactions" ADD CONSTRAINT "budget_category_item_transactions_transaction_type_id_budget_category_item_transaction_types_id_fk" FOREIGN KEY ("transaction_type_id") REFERENCES "public"."budget_category_item_transaction_types"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget_category_items" ADD CONSTRAINT "budget_category_items_category_id_budget_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."budget_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
