import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["admin", "standard_user"]);
export const approvalStatusEnum = pgEnum("approval_status", ["pending", "approved", "rejected"]);
export const stagingStatusEnum = pgEnum("staging_status", ["pending", "approved", "rejected"]);
export const targetTypeEnum = pgEnum("target_type", ["exercise", "routine"]);
export const workoutPhaseEnum = pgEnum("workout_phase", ["warm_up", "the_thang", "mary"]);
export const bodyPartEnum = pgEnum("body_part", ["chest", "arms", "legs", "back", "core", "shoulders", "full_body"]);
export const groupingEnum = pgEnum("grouping", ["solo", "partner", "team"]);
export const equipmentFeatureEnum = pgEnum("equipment_feature", [
  "none",
  "coupon_sandbag",
  "ruck",
  "kettlebell",
  "jump_rope",
  "pullup_bar",
  "wall",
  "hill",
  "turf_field",
  "parking_lot",
]);
export const routineFormatEnum = pgEnum("routine_format", ["for_time", "amrap", "emom", "rounds", "chipper"]);

// ─── Tables ──────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firebaseUid: text("firebase_uid").unique().notNull(),
  email: text("email").unique().notNull(),
  role: userRoleEnum("role").notNull().default("standard_user"),
  approvalStatus: approvalStatusEnum("approval_status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const exercises = pgTable(
  "exercises",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    exiconId: integer("exicon_id"),
    phases: workoutPhaseEnum("phases").array(),
    bodyParts: bodyPartEnum("body_parts").array(),
    grouping: groupingEnum("grouping").array(),
    equipment: equipmentFeatureEnum("equipment").array(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("exercises_phases_idx").using("gin", table.phases),
    index("exercises_body_parts_idx").using("gin", table.bodyParts),
    index("exercises_grouping_idx").using("gin", table.grouping),
    index("exercises_equipment_idx").using("gin", table.equipment),
  ]
);

export const routineTemplates = pgTable(
  "routine_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    exiconId: integer("exicon_id"),
    formatType: routineFormatEnum("format_type").notNull(),
    phases: workoutPhaseEnum("phases").array(),
    bodyParts: bodyPartEnum("body_parts").array(),
    grouping: groupingEnum("grouping").array(),
    equipment: equipmentFeatureEnum("equipment").array(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("routine_templates_phases_idx").using("gin", table.phases),
    index("routine_templates_body_parts_idx").using("gin", table.bodyParts),
    index("routine_templates_grouping_idx").using("gin", table.grouping),
    index("routine_templates_equipment_idx").using("gin", table.equipment),
  ]
);

export const exiconStaging = pgTable(
  "exicon_staging",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    exiconId: integer("exicon_id").unique().notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    rawJson: jsonb("raw_json").notNull(),
    status: stagingStatusEnum("status").notNull().default("pending"),
    targetType: targetTypeEnum("target_type").notNull(),
    phases: workoutPhaseEnum("phases").array(),
    bodyParts: bodyPartEnum("body_parts").array(),
    grouping: groupingEnum("grouping").array(),
    equipment: equipmentFeatureEnum("equipment").array(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("exicon_staging_phases_idx").using("gin", table.phases),
    index("exicon_staging_body_parts_idx").using("gin", table.bodyParts),
    index("exicon_staging_grouping_idx").using("gin", table.grouping),
    index("exicon_staging_equipment_idx").using("gin", table.equipment),
  ]
);
