import { getSchedule } from "./_actions";
import BookingForm from "./components/BookingForm";

const Schedule = async ({ params }: { params: { scheduleId: string } }) => {

    const result = await getSchedule(params.scheduleId);
    
    return (
        result.success
            ? <section className="max-w-7xl mx-auto px-6">
                <BookingForm data={result.data} />
            </section>
            : <main className="min-h-screen w-full flex flex-col justify-center items-center bg-white">
                <h1 className="text-2xl font-bold text-gray-600">Schedule Not found</h1>
                <p className="mt-1 text-center text-sm text-gray-500">Oops, thats on us! We cant find that schedule.</p>
            </main>
    );
}

export default Schedule;