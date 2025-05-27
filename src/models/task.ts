import {
  pgTable,
  serial,
  integer,
  boolean,
  varchar,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./user";
export const task = pgTable("task", {
  id: serial("id").primaryKey(),
  description: varchar("description", { length: 255 }),
  is_completed: boolean("is_completed").default(false),
  position: integer("position").default(0),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
