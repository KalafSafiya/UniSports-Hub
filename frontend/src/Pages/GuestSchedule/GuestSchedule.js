import React, { useState, useEffect } from "react";
import Navbar from "../../GuestComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api";

// import {
//     getAllApprovedBookings
// } from '../../Services/bookingService'
import {
    getAllApprovedSchedules
} from '../../Services/scheduleService'
import {
    getAllVenues
} from '../../Services/venueService'
import {
    getApprovedSports
} from '../../Services/sportService'

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
    const [venues, setVenues] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [sports, setSports] = useState([]);
    const [approvedBookings, setApprovedBookings] = useState([]);

    useEffect(() => {
        fetchVenues();
        fetchApprovedSports();
        fetchSchedules();
        fetchApprovedBookings();
        // eslint-disable-next-line
    }, []);

    const fetchVenues = async () => {
        try {
            const data = await getAllVenues();
            setVenues(Array.isArray(data) ? data : []);
        }
        catch (error) {
            console.error('Error fetching venues: ', error);
        }
    }

    const fetchApprovedSports = async () => {
        try {
            const data = await getApprovedSports();
            setSports(Array.isArray(data) ? data : []);
        }
        catch (error) {
            console.error('Error fetching sports: ', error);
        }
    }

    const fetchApprovedBookings = async () => {
        try {
            const res = await api.get('/bookings/approved');

            const formatted = res.data.map(b => ({
                id: `booking-${b.booking_id}`,
                type: "Event", // or b.type if you have it
                sport: b.Sport?.sport_name || "N/A",
                venue: b.Venue?.name || "N/A",
                date: b.date,
                time: `${formatTime(b.start_time)} - ${formatTime(b.end_time)}`,
                purpose: b.event_name || "Booking"
            }));

            setApprovedBookings(formatted);
        } catch (error) {
            console.error('Error fetching approved bookings: ', error);
        }
    }

    const fetchSchedules = async () => {
        try {
            const data = await getAllApprovedSchedules();

            const formatted = data.map(s => ({
                id: s.schedule_id,
                type: s.type,
                sport: s.Sport?.sport_name || 'N/A',
                venue: s.Venue?.name || 'N/A',
                date: formatDate(s.date),
                time: `${formatTime(s.start_time)} - ${formatTime(s.end_time)}`,
            }));
            
            setSchedules(formatted);
        }
        catch (error) {
            console.error('Error fetching schedules: ', error);
        }
    }
    
    const formatTime = (timeString) => {
        const date = new Date(`1970-01-01T${timeString}`);

        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`
    }

    const [currentDate, setCurrentDate] = useState(new Date());

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        universityId: '',
        sport_id: '',
        team_name: '',
        venue_id: '',
        date: '',
        timeSlot: '',
        event_name: '',
        additional_notes: ''
    });

    const allEvents = [...schedules, ...approvedBookings];

    const todayStr = new Date().toISOString().split('T')[0];

    const allEvents2 = allEvents.filter(event => event.date >= todayStr);


    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString("default", { month: "long" });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const getEventsForDay = (day) => {
        const d = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return allEvents2.filter(e => e.date === d);
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Safety check for timeSlot split
        if (!formData.timeSlot.includes(" - ")) {
            return alert("Please select a valid time slot.");
        }

        const [rawStart, rawEnd] = formData.timeSlot.split(" - ");

        const formatTime = (timeStr) => {
            const [time, modifier] = timeStr.split(" ");
            let [hours, minutes] = time.split(":");
            if (hours === "12") {
                hours = modifier === "AM" ? "00" : "12";
            } else if (modifier === "PM") {
                hours = parseInt(hours, 10) + 12;
            }
            return `${String(hours).padStart(2, '0')}:${minutes}:00`;
        };

        const payload = {
            role: formData.role,
            user_name: formData.name, // Matches controller
            user_email: formData.email, // Matches controller
            university_id: formData.universityId,
            sport_id: formData.sport_id,
            venue_id: formData.venue_id,
            team_name: formData.team_name, 
            date: formData.date,
            start_time: formatTime(rawStart),
            end_time: formatTime(rawEnd),
            event_name: formData.event_name,
            additional_notes: formData.additional_notes
        };

        try {
            await api.post("/bookings", payload);
            setShowSuccessModal(true); 
            setFormData({
                name: "", email: "", role: "", universityId: "",
                sport_id: "", team_name: "", venue_id: "", date: "",
                timeSlot: "", event_name: "", additional_notes: ""
            });
        } catch (error) {
            console.error("Submission failed:", error.response?.data || error.message);
            alert("Error submitting request. Please check availability.");
        }
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
                                {allEvents2.map(e => (
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
                                <input name="name" value={formData.name} required className="w-full border p-2 rounded" placeholder="Full Name" onChange={handleChange} />
                                <input name="email" value={formData.email} required type="email" className="w-full border p-2 rounded" placeholder="University Email" onChange={handleChange} />
                                
                                <select name="role" value={formData.role} required className="w-full border p-2 rounded" onChange={handleChange}>
                                    <option value="">Select Role</option>
                                    <option value="Student">Student</option>
                                    <option value="Coach">Coach</option>
                                    <option value="Staff">Staff</option>
                                </select>

                                {formData.role === "Student" && (
                                    <input name="universityId" value={formData.universityId} required className="w-full border p-2 rounded" placeholder="University ID" onChange={handleChange} />
                                )}

                                <select name="sport_id" value={formData.sport_id} required className="w-full border p-2 rounded" onChange={handleChange}>
                                    <option value="">Select Sport</option>
                                    {sports.map(s => <option key={s.sport_id} value={s.sport_id}>{s.sport_name}</option>)}
                                </select>

                                <input name="team_name" value={formData.team_name} className="w-full border p-2 rounded" placeholder="Team Name" onChange={handleChange} />

                                <select name="venue_id" value={formData.venue_id} required className="w-full border p-2 rounded" onChange={handleChange}>
                                    <option value="">Select Venue</option>
                                    {venues.map(v => <option key={v.venue_id} value={v.venue_id}>{v.name} ({v.location})</option>)}
                                </select>

                                <input type="date" name="date" value={formData.date} required className="w-full border p-2 rounded" onChange={handleChange} />

                                <select name="timeSlot" value={formData.timeSlot} required className="w-full border p-2 rounded" onChange={handleChange}>
                                    <option value="">Select Time Slot</option>
                                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>

                                <input name="event_name" value={formData.event_name} required className="w-full border p-2 rounded" placeholder="Purpose / Event Name" onChange={handleChange} />
                                <textarea name="additional_notes" value={formData.additional_notes} className="w-full border p-2 rounded" placeholder="Additional Notes" onChange={handleChange} />
                                
                                <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">Submit Booking Request</button>
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

                            {/* SUCCESS MODAL CODE BLOCK */}
                            {showSuccessModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                                    <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-2xl animate-in zoom-in duration-200">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
                                        <p className="text-gray-600 mb-8">
                                            Your booking request has been sent to the admin. You will receive an email confirmation once it is reviewed.
                                        </p>
                                        <button 
                                            onClick={() => setShowSuccessModal(false)}
                                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition shadow-lg"
                                        >
                                            Got it, thanks!
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Schedules;
