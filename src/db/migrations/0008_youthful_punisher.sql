ALTER TABLE "budgets" RENAME COLUMN "is_archived" TO "is_active";--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "is_active" SET DEFAULT true;