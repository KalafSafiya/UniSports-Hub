import React, { useState } from "react";
import Navbar from "../../GuestComponents/NavBar";
import Footer from "../../GuestComponents/Footer";

/* ================= DATA ================= */
const schedules = [
    { id: 1, type: "Practice", sport: "Basketball", venue: "Basketball Court", date: "2025-11-03", time: "10:00 AM - 12:00 PM", purpose: "Practice Session" },
    { id: 2, type: "Match", sport: "Football", venue: "Outdoor Ground", date: "2025-11-05", time: "2:00 PM - 4:00 PM", purpose: "Friendly Match" }
];

const approvedBookings = [
    { id: 101, type: "Event", sport: "Volleyball", venue: "Indoor Sports Complex", date: "2025-11-12", time: "11:00 AM - 1:00 PM", purpose: "Inter-Faculty Event" }
];

const venues = [
    "Outdoor Ground", "Indoor Sports Complex", "Basketball Court",
    "Tennis Court", "Badminton Hall", "Cricket Nets", "Football Field"
];

const sports = [
    "Basketball", "Football", "Cricket", "Tennis", "Volleyball",
    "Badminton", "Hockey", "Rugby", "Netball"
];

const generateTimeSlots = () => {
    const slots = [];
    for (let h = 6; h < 18; h += 2) {
        const fromHour = h % 12 === 0 ? 12 : h % 12;
        const toHour = (h + 2) % 12 === 0 ? 12 : (h + 2) % 12;
        const from = `${fromHour}:00 ${h < 12 ? "AM" : "PM"}`;
        const to = `${toHour}:00 ${(h + 2) < 12 ? "AM" : "PM"}`;
        slots.push(`${from} - ${to}`);
    }
    return slots;
};

const timeSlots = generateTimeSlots();

const typeColor = {
    Practice: "bg-blue-400",
    Match: "bg-green-400",
    Event: "bg-purple-400"
};

/* ================= COMPONENT ================= */
function Schedules() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));
    const [formData, setFormData] = useState({
        name: "", email: "", role: "", universityId: "",
        sport: "", team: "", venue: "", date: "",
        timeSlot: "", purpose: "", additionalNotes: ""
    });

    const allEvents = [...schedules, ...approvedBookings];

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString("default", { month: "long" });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const getEventsForDay = (day) => {
        const d = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return allEvents.filter(e => e.date === d);
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Booking request submitted successfully!");
    };

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow pt-20 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4">

                    {/* HEADER */}
                    <h1 className="text-3xl font-bold text-center mb-2">
                        Schedules & Venue Booking
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        View sports schedules, check venue availability, and submit booking requests for practices, matches, or special events.
                    </p>

                    {/* ===== TABLE VIEW ===== */}
                    <div className="bg-white rounded-xl shadow mb-10 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    {["Type", "Sport", "Date", "Time", "Venue", "Purpose"].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {allEvents.map(e => (
                                    <tr key={e.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${typeColor[e.type]}`}>
                                                {e.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{e.sport}</td>
                                        <td className="px-6 py-4 text-gray-700">{e.date}</td>
                                        <td className="px-6 py-4 text-gray-700">{e.time}</td>
                                        <td className="px-6 py-4 text-gray-700">{e.venue}</td>
                                        <td className="px-6 py-4 text-gray-700">{e.purpose}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ===== FORM + CALENDAR ===== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

                        {/* ===== BOOKING FORM ===== */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-bold mb-4">Venue Booking Request</h2>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input name="name" required className="w-full border p-2 rounded" placeholder="Full Name" onChange={handleChange} />
                                <input name="email" required type="email" className="w-full border p-2 rounded" placeholder="University Email" onChange={handleChange} />
                                <select name="role" required className="w-full border p-2 rounded" onChange={handleChange}>
                                    <option value="">Select Role</option>
                                    <option>Student</option>
                                    <option>Coach</option>
                                    <option>Staff</option>
                                </select>
                                {formData.role === "Student" && (
                                    <input name="universityId" required className="w-full border p-2 rounded" placeholder="University ID" onChange={handleChange} />
                                )}
                                <select name="sport" required className="w-full border p-2 rounded" onChange={handleChange}>
                                    <option value="">Select Sport</option>
                                    {sports.map(s => <option key={s}>{s}</option>)}
                                </select>
                                <input name="team" required className="w-full border p-2 rounded" placeholder="Team Name" onChange={handleChange} />
                                <select name="venue" required className="w-full border p-2 rounded" onChange={handleChange}>
                                    <option value="">Select Venue</option>
                                    {venues.map(v => <option key={v}>{v}</option>)}
                                </select>
                                <input type="date" name="date" required className="w-full border p-2 rounded" onChange={handleChange} />
                                <select name="timeSlot" required className="w-full border p-2 rounded" onChange={handleChange}>
                                    <option value="">Select Time Slot</option>
                                    {timeSlots.map(t => <option key={t}>{t}</option>)}
                                </select>
                                <input name="purpose" required className="w-full border p-2 rounded" placeholder="Purpose / Event Name" onChange={handleChange} />
                                <textarea name="additionalNotes" className="w-full border p-2 rounded" placeholder="Additional Notes" onChange={handleChange} />
                                <button className="w-full bg-primary text-white py-2 rounded">Submit Booking Request</button>
                            </form>
                        </div>

                        {/* ===== CALENDAR ===== */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">← Previous</button>
                                <h2 className="text-xl font-bold">{monthName} {year}</h2>
                                <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Next →</button>
                            </div>

                            {/* Weekdays */}
                            <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-700">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2 mt-2">
                                {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}

                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const events = getEventsForDay(day);
                                    return (
                                        <div key={day} className="h-24 border rounded-lg p-1 text-xs">
                                            <div className="font-semibold">{day}</div>
                                            {events.map((e, idx) => (
                                                <div key={idx} className={`mt-1 px-1 rounded text-white truncate ${typeColor[e.type]}`} title={`${e.purpose} | ${e.venue} | ${e.time}`}>
                                                    {e.sport}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Schedules;
