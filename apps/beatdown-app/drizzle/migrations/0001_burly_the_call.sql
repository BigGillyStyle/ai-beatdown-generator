ALTER TABLE "exercises" ALTER COLUMN "phases" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "phases" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "body_parts" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "body_parts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "grouping" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "grouping" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "equipment" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "equipment" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exicon_staging" ALTER COLUMN "phases" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "exicon_staging" ALTER COLUMN "phases" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exicon_staging" ALTER COLUMN "body_parts" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "exicon_staging" ALTER COLUMN "body_parts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exicon_staging" ALTER COLUMN "grouping" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "exicon_staging" ALTER COLUMN "grouping" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exicon_staging" ALTER COLUMN "equipment" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "exicon_staging" ALTER COLUMN "equipment" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "routine_templates" ALTER COLUMN "phases" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "routine_templates" ALTER COLUMN "phases" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "routine_templates" ALTER COLUMN "body_parts" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "routine_templates" ALTER COLUMN "body_parts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "routine_templates" ALTER COLUMN "grouping" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "routine_templates" ALTER COLUMN "grouping" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "routine_templates" ALTER COLUMN "equipment" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "routine_templates" ALTER COLUMN "equipment" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "exercises_exicon_id_idx" ON "exercises" USING btree ("exicon_id");--> statement-breakpoint
CREATE INDEX "routine_templates_exicon_id_idx" ON "routine_templates" USING btree ("exicon_id");