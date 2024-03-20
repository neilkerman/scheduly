"use server"

import { db } from "@/database"
import { Booking, Schedule } from "@/database/schema"
import { BookingFormInput } from "@/utils/declarations"
import { eq } from "drizzle-orm"

/**
 * This Action is used to get a schedule and 
 * its bookings from the database
 * 
 * @param scheduleId 
 * @returns schedule
 */
export async function getSchedule(scheduleId: string) {
    try {
        const result = await db.query.Schedule.findFirst({
            where: eq(Schedule.id, scheduleId),
            with: {
                bookings: true
            }
        })

        return { success: true, data: result }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Data not found" }
    }
}

/**
 * This action is used to add a booking for a given schedule.
 * 
 * @param scheduleId 
 * @param data 
 * @returns void
 */
export async function addBooking(scheduleId: string, data: BookingFormInput) {
    data.time = new Date(data.time)
    data.date = new Date(data.date)
    const result = BookingFormInput.safeParse(data)

    if (!result.success) {
        console.error(result.error.format())
        return { success: false, message: "Something went wrong" }
    }

    data.date.setHours(data.time.getHours(), data.time.getMinutes(), 0)

    try {

        await db.insert(Booking).values({
            scheduleId: scheduleId,
            email: data.email,
            datetime: data.date,
        });

        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Something went wrong" }
    }
}