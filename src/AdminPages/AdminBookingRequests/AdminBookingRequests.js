import React, { useState } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";

function AdminBookingRequests() {
    // Mock data for now, replace with API fetch later
    const [bookings, setBookings] = useState([
        {
            booking_id: 1,
            name: "John Doe",
            email: "john@vau.ac.lk",
            role: "Student",
            university_id: "2021/ICT/001",
            sport: "Basketball",
            team: "Vavuniya Kings",
            venue: "Indoor Sports Complex",
            date: "2026-01-15",
            time_slot: "10:00 AM - 12:00 PM",
            purpose: "Practice Session",
            additional_notes: "Need extra basketballs",
            status: "pending"
        },
        {
            booking_id: 2,
            name: "Coach Silva",
            email: "silva@vau.ac.lk",
            role: "Coach",
            sport: "Football",
            team: "Vavuniya Tigers",
            venue: "Football Field",
            date: "2026-01-18",
            time_slot: "2:00 PM - 4:00 PM",
            purpose: "Friendly Match",
            status: "pending"
        }
    ]);

    const handleApprove = (id) => {
        setBookings(bookings.map(b => b.booking_id === id ? { ...b, status: "approved" } : b));
    };

    const handleReject = (id) => {
        setBookings(bookings.map(b => b.booking_id === id ? { ...b, status: "rejected" } : b));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Venue Booking Requests
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Review and manage all venue booking requests submitted by guests.
                    </p>

                    {bookings.length === 0 ? (
                        <p className="text-gray-500">No booking requests.</p>
                    ) : (
                        <div className="space-y-6">
                            {bookings.map((b) => (
                                <div key={b.booking_id} className="bg-white rounded-lg shadow p-5 border">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {b.purpose} - {b.team}
                                            </h3>
                                            <p className="text-gray-600">
                                                {b.name} ({b.role}) {b.university_id && `- ${b.university_id}`}
                                            </p>
                                            <p className="text-gray-600">Email: {b.email}</p>
                                            <p className="text-gray-600">Sport: {b.sport}</p>
                                            <p className="text-gray-600">Venue: {b.venue}</p>
                                            <p className="text-gray-600">
                                                Date: {b.date} | Time: {b.time_slot}
                                            </p>
                                            {b.additional_notes && (
                                                <p className="text-gray-700 mt-1">Notes: {b.additional_notes}</p>
                                            )}
                                            <p className={`mt-2 font-semibold ${b.status === "approved" ? "text-green-600" :
                                                    b.status === "rejected" ? "text-red-600" : "text-yellow-600"
                                                }`}>
                                                Status: {b.status}
                                            </p>
                                        </div>

                                        {b.status === "pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(b.booking_id)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(b.booking_id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AdminBookingRequests;
