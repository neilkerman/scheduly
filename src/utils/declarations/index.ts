import { z } from "zod";

export const ScheduleFormInput = z.object({
    name: z.string(),
    email: z.string(),
    daysAvailable: z.string().array(),
    availableFrom: z.date(),
    availableTo: z.date(),
    bufferBefore: z.number(),
    bufferAfter: z.number(),
    maxBookings: z.number()

})

export const BookingFormInput = z.object({
    email: z.string(),
    date: z.date(),
    time: z.date(),
})

export type ScheduleFormInputType = z.infer<typeof ScheduleFormInput>;
export type BookingFormInput = z.infer<typeof BookingFormInput>;