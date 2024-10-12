ALTER TABLE "transaction_types" ADD COLUMN "budget_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_types" ADD CONSTRAINT "transaction_types_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
