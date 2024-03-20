"use client"

import { useState } from "react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { getSchedule } from "./_actions"

const MySchedule = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [schedules, setSchedules] = useState<any[]>()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string }>()

    const onSubmit: SubmitHandler<{ email: string }> = async (data: { email: string }) => {
        setError(false)
        setLoading(true)
        const result = await getSchedule(data.email)
        setLoading(false)

        console.log(result)

        if (!result.success) {
            setError(true)
        } else {
            setSchedules(result.data)
        }
    }

    return (
        <main className="container mt-24 w-full">
            <h1 className="text-3xl font-semibold text-gray-800">My Schedules</h1>
            <p className="mt-2 text-sm text-gray-500 w-1/3">Enter your email below to see your schedules and their appointment bookings!</p>
            <div className="my-10  w-full h-0.5 bg-gradient-to-r from-blue-100 to-transparent"></div>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto flex flex-row items-start gap-3 mb-10">
                <div className="w-full">
                    <input id="email" type="email" className="text-input w-full" placeholder="Your Email" {...register("email", { required: true, validate: t => (t !== '') && (t.indexOf('@') > -1) })} />
                    {errors.email && <p className="text-sm text-rose-500 mt-2">A valid email is required</p>}
                </div>

                {loading ? <div className="mx-auto my-10 size-6 rounded-full border-t-2 bottom-b-2 border-l-2 border-blue-500 animate-spin" /> : <input className="block px-3 py-2 text-sm button !rounded-xl" type="submit" value="Search" />}
            </form>

            {schedules?.map((schedule) =>
                <div key={schedule.id} className="w-full border border-gray-300 rounded-xl mb-6">
                    <h4 className="p-3 border-b border-gray-300 text-sm font-semibold text-gray-500">
                        Schedule Id: {schedule.id}
                    </h4>

                    {
                        schedule.bookings.map((booking: any, index: number) => <div key={booking.id} className="m-3 p-3 border border-gray-300 rounded-lg flex flex-row justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-500">Booking #{(index + 1)}</h3>
                                <p className="text-sm text-gray-400">{booking.email}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 text-right">{booking.datetime.toLocaleDateString("en-GB")}</p>
                                <p className="text-sm text-gray-400 text-right">{booking.datetime.toLocaleTimeString(["en-US"], { hour: "2-digit", minute: "2-digit" })}</p>
                            </div>
                        </div>)
                    }


                </div>
            )}
        </main>
    );
}

export default MySchedule;