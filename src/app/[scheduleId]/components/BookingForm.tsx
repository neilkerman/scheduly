"use client"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { useState } from "react";
import DatePicker from "react-datepicker";
import { BookingFormInput } from "@/utils/declarations";
import { addBooking } from "../_actions";

const toMinutes = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return hours * 60 + minutes;
};

function roundToNearestHalfHour() {
    var date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setMinutes(Math.ceil(date.getMinutes() / 30) * 30);
    return date;
}

function getAvailableTimeSlots(
    minTime: Date,
    maxTime: Date,
    selectedDate: Date | null,
    bookedDateTime: Date[],
    bufferBefore: number,
    bufferAfter: number
): Date[] {
    if (!selectedDate) return []

    const minMinutes = toMinutes(minTime);
    const maxMinutes = toMinutes(maxTime);

    let result: Date[] = [];

    for (let i = minMinutes; i <= maxMinutes; i += 30) {
        let conflict = false;
        for (let j = 0; j < bookedDateTime.length; j++) {
            const booking = bookedDateTime[j];
            if (booking.toDateString() === selectedDate.toDateString()) {
                const bookingMinutes = toMinutes(booking);
                if (bookingMinutes <= i && i <= bookingMinutes + bufferBefore + bufferAfter) {
                    conflict = true;
                    i = bookingMinutes + bufferBefore + bufferAfter;
                    break;
                }
            }
        }
        if (!conflict) {
            let d = new Date()
            d.setHours(Math.floor(i / 60), i % 60, 0)
            result.push(d);
        }
    }
    return result;
}

const BookingForm = ({ data }: any) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)

    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<BookingFormInput>({
        defaultValues: {
            date: new Date()
        }
    })

    const isNotAvailable = (date: Date) => {
        return data.daysAvailable.includes(date.getDay().toString())
    };

    const currentDate = new Date()

    const slotsAvailableFrom = (new Date(watch('date'))).toDateString() === currentDate.toDateString() ? (data.availableHourFrom < currentDate ? roundToNearestHalfHour() : data.availableHourFrom ) : data.availableHourFrom

    const availableTimeSlots = getAvailableTimeSlots(slotsAvailableFrom, data.availableHourTo, new Date(watch('date')), data.bookings.map((booking: any) => new Date(booking.datetime)), data.bufferPeriodBefore, data.bufferPeriodAfter)

    const allTimeSlotsBooked = !isNotAvailable(watch('date')) || availableTimeSlots.length < 1 || data.bookings.filter((booking: any) => (new Date(booking.datetime)).toDateString() === (new Date(watch('date'))).toDateString()).length >= data.maxBookings

    const onSubmit: SubmitHandler<BookingFormInput> = async (formdata: BookingFormInput) => {
        setLoading(true)
        const result = await addBooking(data.id, formdata)
        setLoading(false)

        if (!result.success) {
            alert("Something went wrong, try again later")
        } else {
            reset()
            setSuccess(true)
        }
    }

    return (
        <div className="w-full h-full grid grid-cols-2 gap-6">
            <div className="mt-24 sticky">
                <h1 className="text-3xl font-semibold text-gray-800">Book an Appointment with <br /><span className="text-blue-500">{data!.name}</span></h1>
                <p className="mt-2 text-sm text-gray-500 w-1/2">Select your prefered date and time from the slots below to booking an appointment.</p>
                <p className="mt-2 text-sm font-semibold text-gray-500 w-1/2">Each slot is of 30 minutes</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-24">
                {
                    success && <p className="mb-6 rounded-xl w-full text-sm p-3 bg-green-50 border border-green-500 text-green-600 font-semibold">Appointment booked successfully!</p>
                }
                <label className="input-label" htmlFor="email">Your Email</label>
                <input id="email" type="email" className="text-input" {...register("email", { required: true, validate: t => (t !== '') && (t.indexOf('@') > -1) })} />
                {errors.email && <p className="text-sm text-rose-500 mt-2">A valid email is required</p>}

                <label className="mt-6 input-label" htmlFor="subject">Select Preferred Date</label>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            selected={value}
                            minDate={new Date()}
                            onChange={(date) => onChange(date)}
                            filterDate={isNotAvailable}
                            inline
                        />
                    )}
                    name="date"
                />
                {errors.date && <p className="text-sm text-rose-500 mt-2">You need to select a date</p>}

                <h4 className="mt-6 input-label">Select Preferred Time Slot</h4>

                {allTimeSlotsBooked
                    ? <p className="text-sm font-semibold p-3 border border-gray-500 rounded-xl text-gray-600 bg-gray-100">Oops, No time slots available for this date</p>
                    : <div className="mt-3 text-sm text-gray-600 select-none *:py-1 *:inline-block *:mr-3 *:w-32 *:cursor-pointer *:text-center *:rounded-lg *:border *:mb-2 [&_input]:appearance-none *:transition-all *:duration-100">
                        {
                            availableTimeSlots.map((timeSlot, index) =>
                                <label key={index} className="has-[:checked]:bg-blue-100 has-[:checked]:text-blue-600 has-[:checked]:border-blue-500">
                                    <span>{timeSlot.toLocaleTimeString(["en-US"], { hour: "2-digit", minute: "2-digit" })}</span>
                                    <input type="radio" {...register("time", { required: true })} value={timeSlot.toString()} />
                                </label>
                            )
                        }
                    </div>
                }
                {errors.time && <p className="text-sm text-rose-500 mt-2">You need to select a time</p>}

                {loading
                    ? <div className="mx-auto my-10 size-6 rounded-full border-t-2 bottom-b-2 border-l-2 border-blue-500 animate-spin" />
                    : !allTimeSlotsBooked && <input className="mt-6 px-3 py-2 button !rounded-xl !mx-auto" type="submit" value="Book Appointment" disabled={allTimeSlotsBooked} />
                }
            </form>
        </div>
    );
}

export default BookingForm;