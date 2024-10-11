ALTER TABLE "budgets" ALTER COLUMN "budget_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "budget_categories" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "budget_category_items" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "transaction_types" ADD COLUMN "user_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget_categories" ADD CONSTRAINT "budget_categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget_category_items" ADD CONSTRAINT "budget_category_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_types" ADD CONSTRAINT "transaction_types_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
