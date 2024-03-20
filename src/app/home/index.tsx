"use client"

import { ScheduleFormInputType } from "@/utils/declarations"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { addSchedule } from "./_actions";
import { useState } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";

const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

const minTime: () => Date = () => {
    let d = new Date()
    d.setHours(0,0,0)
    return d
}

const maxTime: () => Date = () => {
    let d = new Date()
    d.setHours(23,59,0)
    return d
}

const Home = () => {
    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ScheduleFormInputType>()

    const [link, setLink] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit: SubmitHandler<ScheduleFormInputType> = async (data: ScheduleFormInputType) => {
        setLoading(true)
        const result = await addSchedule(data)
        setLoading(false)

        if (!result.success) {
            alert("Something went wrong, try again later")
        }else{
            setLink(`http://localhost:3000/${result.id}`)
        }
    }

    return (
        <main className="container mt-24 w-full">
            <h1 className="text-3xl font-semibold text-gray-800">Welcome to <span className="text-blue-500">Scheduly</span></h1>
            <p className="mt-2 text-sm text-gray-500 w-1/3">Fill in your availability details and share the generated link to start booking your appointments!</p>
            <div className="my-10  w-full h-0.5 bg-gradient-to-r from-blue-100 to-transparent"></div>

            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-gray-600 font-semibold text-lg">Your Details</h2>
                        <p className="text-sm font-light text-gray-500">Your schedule shall be tied to the details you provide here</p>
                    </div>

                    <div>
                        <label className="input-label" htmlFor="name">Your Name</label>
                        <input id="name" type="text" className="text-input" {...register("name", { required: true })} />
                        {errors.name && <p className="text-sm text-rose-500 mt-2">Name is Required</p>}

                        <label className="mt-10 input-label" htmlFor="email">Your Email</label>
                        <input id="email" type="email" className="text-input" {...register("email", { required: true, validate: t => (t !== '') && (t.indexOf('@') > -1) })} />
                        {errors.email && <p className="text-sm text-rose-500 mt-2">A valid email is required</p>}
                    </div>
                </div>

                <div className="mt-12 pt-12 border-t border-gray-200 grid grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-gray-600 font-semibold text-lg">Your Schedule</h2>
                        <p className="text-sm font-light text-gray-500">Add details about your schedule for appointments</p>
                    </div>

                    <div>
                        <h4 className="input-label">Select days you are available</h4>

                        <div className="mt-4 max-w-32 text-sm text-gray-600 select-none *:py-1  *:cursor-pointer *:w-full *:block *:text-center *:rounded-lg *:border *:mb-2 [&_input]:appearance-none *:transition-all *:duration-100">
                            {
                                weekdays.map((weekday, index) =>
                                    <label key={index} className="has-[:checked]:bg-blue-100 has-[:checked]:text-blue-600 has-[:checked]:border-blue-500">
                                        {weekday}
                                        <input type="checkbox" {...register("daysAvailable", { required: true, valueAsNumber: true })} value={index} />
                                    </label>
                                )
                            }
                        </div>
                        {errors.daysAvailable && <p className="text-sm text-rose-500 mt-2">Select atleast 1 day</p>}

                        <h4 className="mt-10 input-label">Select the time range you&apos;ll be available each day</h4>
                        <div className="mt-3 flex flex-row items-center gap-3 justify-center">
                            <label className="input-label pt-1" htmlFor="availableFrom">From</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <DatePicker
                                        className="text-input"
                                        selected={value}
                                        onChange={onChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        minTime={minTime()}
                                        maxTime={watch('availableTo') ?? maxTime()}
                                        timeIntervals={30}
                                        timeCaption="From"
                                        dateFormat="h:mm aa"
                                    />
                                )}
                                name="availableFrom"
                            />
                            <p className="text-gray-300">—</p>
                            <label className="input-label pt-1" htmlFor="availableTo">Till</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <DatePicker
                                        className="text-input"
                                        selected={value}
                                        onChange={onChange}
                                        minTime={watch('availableFrom') ?? minTime()}
                                        maxTime={maxTime()}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        timeCaption="Till"
                                        dateFormat="h:mm aa"
                                    />
                                )}
                                name="availableTo"
                            />
                        </div>
                        {errors.availableFrom && <p className="text-sm text-rose-500 mt-2">Start time should be smaller than end time</p>}
                        {errors.availableTo && <p className="text-sm text-rose-500 mt-2">End time should be greater than start time</p>}


                        <h4 className="mt-10 input-label">Select the buffer period in minutes</h4>
                        <div className="mt-3 flex flex-row items-center gap-3 justify-center">
                            <label className="input-label pt-1" htmlFor="bufferBefore">Before</label>
                            <input id="bufferBefore" {...register("bufferBefore", { min: 0, max: 59, required: true, valueAsNumber: true })} type="number" className="text-input" />

                            <label className="input-label pt-1" htmlFor="bufferAfter">After</label>
                            <input id="bufferAfter" {...register("bufferAfter", { min: 0, max: 59, required: true, valueAsNumber: true })} type="number" className="text-input" />
                        </div>
                        {(errors.bufferBefore || errors.bufferAfter) && <p className="text-sm text-rose-500 mt-2">Add a valid buffer time</p>}

                        <label className="mt-10 input-label" htmlFor="maxBookingsPerDay">Max bookings per day</label>
                        <input id="maxBookingsPerDay" {...register("maxBookings", { required: true, valueAsNumber: true })} type="number" className="text-input" />
                        {errors.maxBookings && <p className="text-sm text-rose-500 mt-2">Add a valid max bookings count</p>}
                    </div>
                </div>

                {loading && <div className="mx-auto my-10 size-6 rounded-full border-t-2 bottom-b-2 border-l-2 border-blue-500 animate-spin" />}

                {link ?
                    <div className="my-10 flex flex-col justify-center items-center">
                        <p className="p-3 rounded-xl border border-gray-300 w-full">
                            <span className="block text-sm font-semibold text-gray-500 mb-2">Your schedule link:</span>
                            <Link href={link} target="_blank" className="mt-1 text-blue-500 hover:underline">{link}</Link>
                        </p>
                        <button onClick={() => {
                            setLink(undefined)
                            reset()
                        }} className="mt-4 text-sm button px-3 py-2 !rounded-xl" >Add Another Schedule</button>
                    </div>
                    :
                    <div className="my-10 w-full flex flex-col justify-center items-center">
                        <input className="px-3 py-2 button !rounded-xl !mx-auto" type="submit" value="Save Schedule and Generate Link" />
                    </div>
                }
            </form>
        </main>
    );
}

export default Home;