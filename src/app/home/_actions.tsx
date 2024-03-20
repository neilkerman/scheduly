"use server"
import { db } from "@/database";
import { Schedule } from "@/database/schema";
import { ScheduleFormInput, ScheduleFormInputType } from "@/utils/declarations";

/**
 * This action is used to add a schedule and 
 * return the schedule id
 * 
 * @param data 
 * @returns scheduleId
 */
export async function addSchedule(data: ScheduleFormInputType) {

    const result = ScheduleFormInput.safeParse(data)
    
    if (!result.success) {
        console.error(result.error.format())
        return { success: false, message: "Validation Error" }
    }

    try {
        const dbResult = await db.insert(Schedule).values({
            name: result.data.name,
            email: result.data.email,
            daysAvailable: result.data.daysAvailable,
            availableHourFrom: new Date(result.data.availableFrom),
            availableHourTo: new Date(result.data.availableTo),
            bufferPeriodBefore: result.data.bufferBefore,
            bufferPeriodAfter: result.data.bufferAfter,
            maxBookings: result.data.maxBookings
        }).returning({ scheduleId: Schedule.id });

        return { success: true, id: dbResult[0].scheduleId }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Something went wrong"}
    }
}