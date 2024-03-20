import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import {
    integer,
    jsonb,
    pgTable,
    text,
    uuid,
    timestamp
} from "drizzle-orm/pg-core";

export const Schedule = pgTable("schedule", {
    id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
    name: text("name"),
    email: text("email"),
    daysAvailable: jsonb("days_available"),
    availableHourFrom: timestamp("availableHourFrom", {withTimezone: true}),
    availableHourTo: timestamp("availableHourTo", {withTimezone: true}),
    bufferPeriodBefore: integer("buffer_period_before"),
    bufferPeriodAfter: integer("buffer_period_after"),
    maxBookings: integer("max_bookings"),
});

export const Booking = pgTable("booking", {
    id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
    scheduleId: uuid("schedule_id").references(() => Schedule.id),
    email: text("email"),
    datetime: timestamp("datetime"),
});

export const scheduleRelations = relations(Schedule, ({ many }) => ({
    bookings: many(Booking),
}));

export const bookingRelations = relations(Booking, ({ one }) => ({
	schedule: one(Schedule, { fields: [Booking.scheduleId], references: [Schedule.id] }),
}));