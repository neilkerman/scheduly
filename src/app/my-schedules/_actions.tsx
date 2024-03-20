"use server"

import { eq } from "drizzle-orm"
import { db } from "@/database"
import { Schedule } from "@/database/schema"

/**
 * This action takes in an and gets all the schedules
 * associated with it, additionally fetches all bookings
 * for the given schedule
 * 
 * @param email 
 * @returns schedules[]
 */
export async function getSchedule(email: string){

    if(!email) return { success: false, message: "Email needs to be added"}

    try {
        const results = await db.query.Schedule.findMany({
            where: eq(Schedule.email, email),
            with: {
                bookings: true
            }
        })

        return { success: true, data: results }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Data not found"}
    }
}