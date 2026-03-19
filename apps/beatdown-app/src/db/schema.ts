import { boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["admin", "standard_user"]);
// Intentionally separate from stagingStatusEnum — user account approval status
// may diverge (e.g. 'suspended') independently of staging content status.
export const approvalStatusEnum = pgEnum("approval_status", ["pending", "approved", "rejected"]);

// Intentionally separate from approvalStatusEnum — staging content review status
// may diverge (e.g. 'needs_review') independently of user approval status.
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
  email: text("email").unique().notNull(),
  name: text("name"),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("standard_user"),
  approvalStatus: approvalStatusEnum("approval_status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
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
    phases: workoutPhaseEnum("phases").array().notNull().default([]),
    bodyParts: bodyPartEnum("body_parts").array().notNull().default([]),
    grouping: groupingEnum("grouping").array().notNull().default([]),
    equipment: equipmentFeatureEnum("equipment").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("exercises_exicon_id_idx").on(table.exiconId),
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
    phases: workoutPhaseEnum("phases").array().notNull().default([]),
    bodyParts: bodyPartEnum("body_parts").array().notNull().default([]),
    grouping: groupingEnum("grouping").array().notNull().default([]),
    equipment: equipmentFeatureEnum("equipment").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("routine_templates_exicon_id_idx").on(table.exiconId),
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
    phases: workoutPhaseEnum("phases").array().notNull().default([]),
    bodyParts: bodyPartEnum("body_parts").array().notNull().default([]),
    grouping: groupingEnum("grouping").array().notNull().default([]),
    equipment: equipmentFeatureEnum("equipment").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("exicon_staging_phases_idx").using("gin", table.phases),
    index("exicon_staging_body_parts_idx").using("gin", table.bodyParts),
    index("exicon_staging_grouping_idx").using("gin", table.grouping),
    index("exicon_staging_equipment_idx").using("gin", table.equipment),
  ]
);
