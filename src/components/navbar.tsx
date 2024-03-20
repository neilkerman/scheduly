import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-12 border-b border-gray-200 bg-white bg-opacity-10 backdrop-blur-sm backdrop-saturate-150">
            <div className="h-full max-w-7xl mx-auto flex flex-row justify-between items-center px-6">
                <Link href="/" className="text-xl font-bold text-gray-800">Schedu<span className="text-blue-500">ly</span></Link>
                <Link href="my-schedules" className="py-1 px-3 button text-sm">My Schedule</Link>
            </div>
        </nav>
    );
}

export default Navbar;