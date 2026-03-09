CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."body_part" AS ENUM('chest', 'arms', 'legs', 'back', 'core', 'shoulders', 'full_body');--> statement-breakpoint
CREATE TYPE "public"."equipment_feature" AS ENUM('none', 'coupon_sandbag', 'ruck', 'kettlebell', 'jump_rope', 'pullup_bar', 'wall', 'hill', 'turf_field', 'parking_lot');--> statement-breakpoint
CREATE TYPE "public"."grouping" AS ENUM('solo', 'partner', 'team');--> statement-breakpoint
CREATE TYPE "public"."routine_format" AS ENUM('for_time', 'amrap', 'emom', 'rounds', 'chipper');--> statement-breakpoint
CREATE TYPE "public"."staging_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."target_type" AS ENUM('exercise', 'routine');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'standard_user');--> statement-breakpoint
CREATE TYPE "public"."workout_phase" AS ENUM('warm_up', 'the_thang', 'mary');--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"exicon_id" integer,
	"phases" "workout_phase"[],
	"body_parts" "body_part"[],
	"grouping" "grouping"[],
	"equipment" "equipment_feature"[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exicon_staging" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exicon_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"raw_json" jsonb NOT NULL,
	"status" "staging_status" DEFAULT 'pending' NOT NULL,
	"target_type" "target_type" NOT NULL,
	"phases" "workout_phase"[],
	"body_parts" "body_part"[],
	"grouping" "grouping"[],
	"equipment" "equipment_feature"[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exicon_staging_exicon_id_unique" UNIQUE("exicon_id")
);
--> statement-breakpoint
CREATE TABLE "routine_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"exicon_id" integer,
	"format_type" "routine_format" NOT NULL,
	"phases" "workout_phase"[],
	"body_parts" "body_part"[],
	"grouping" "grouping"[],
	"equipment" "equipment_feature"[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firebase_uid" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'standard_user' NOT NULL,
	"approval_status" "approval_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_firebase_uid_unique" UNIQUE("firebase_uid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "exercises_phases_idx" ON "exercises" USING gin ("phases");--> statement-breakpoint
CREATE INDEX "exercises_body_parts_idx" ON "exercises" USING gin ("body_parts");--> statement-breakpoint
CREATE INDEX "exercises_grouping_idx" ON "exercises" USING gin ("grouping");--> statement-breakpoint
CREATE INDEX "exercises_equipment_idx" ON "exercises" USING gin ("equipment");--> statement-breakpoint
CREATE INDEX "exicon_staging_phases_idx" ON "exicon_staging" USING gin ("phases");--> statement-breakpoint
CREATE INDEX "exicon_staging_body_parts_idx" ON "exicon_staging" USING gin ("body_parts");--> statement-breakpoint
CREATE INDEX "exicon_staging_grouping_idx" ON "exicon_staging" USING gin ("grouping");--> statement-breakpoint
CREATE INDEX "exicon_staging_equipment_idx" ON "exicon_staging" USING gin ("equipment");--> statement-breakpoint
CREATE INDEX "routine_templates_phases_idx" ON "routine_templates" USING gin ("phases");--> statement-breakpoint
CREATE INDEX "routine_templates_body_parts_idx" ON "routine_templates" USING gin ("body_parts");--> statement-breakpoint
CREATE INDEX "routine_templates_grouping_idx" ON "routine_templates" USING gin ("grouping");--> statement-breakpoint
CREATE INDEX "routine_templates_equipment_idx" ON "routine_templates" USING gin ("equipment");