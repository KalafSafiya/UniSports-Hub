import React, { useState } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";

function AdminScheduleRequests() {
    // Mock data (replace later with data fetched from backend/localStorage)
    const [requests, setRequests] = useState([
        {
            id: 1,
            coach: "Coach Silva",
            sport: "Basketball",
            date: "2025-11-03",
            time: "10:00 - 12:00",
            type: "Practice",
            venue: "Basketball Court",
            status: "Pending",
        },
        {
            id: 2,
            coach: "Coach Priya",
            sport: "Football",
            date: "2025-11-05",
            time: "14:00 - 16:00",
            type: "Match",
            venue: "Outdoor Ground",
            status: "Pending",
        },
    ]);

    const [approved, setApproved] = useState([]);
    const [rejected, setRejected] = useState([]);

    const handleApprove = (req) => {
        const updated = requests.filter((r) => r.id !== req.id);
        setRequests(updated);
        setApproved([...approved, { ...req, status: "Approved" }]);
    };

    const handleReject = (req) => {
        const updated = requests.filter((r) => r.id !== req.id);
        setRequests(updated);
        setRejected([...rejected, { ...req, status: "Rejected" }]);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Schedule Requests Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Review, approve, or reject practice and match session requests submitted by coaches.
                    </p>

                    {/* Pending Requests */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4 text-yellow-600">Pending Schedule Requests</h2>
                        {requests.length === 0 ? (
                            <p className="text-gray-500">No pending schedule requests.</p>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            {["Coach", "Sport", "Date", "Time", "Type", "Venue", "Actions"].map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {requests.map((req) => (
                                            <tr key={req.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-gray-700">{req.coach}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">{req.sport}</td>
                                                <td className="px-6 py-4 text-gray-700">{req.date}</td>
                                                <td className="px-6 py-4 text-gray-700">{req.time}</td>
                                                <td
                                                    className={`px-6 py-4 font-semibold ${req.type === "Match" ? "text-green-600" : "text-blue-600"
                                                        }`}
                                                >
                                                    {req.type}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">{req.venue}</td>
                                                <td className="px-6 py-4 flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req)}
                                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req)}
                                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Approved Section */}
                    {approved.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold mb-4 text-green-700">
                                Approved Sessions
                            </h2>
                            <div className="overflow-hidden rounded-xl border border-green-200 bg-green-50 shadow-sm">
                                <table className="min-w-full divide-y divide-green-100">
                                    <thead className="bg-green-100">
                                        <tr>
                                            {["Coach", "Sport", "Date", "Time", "Type", "Venue"].map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-green-700"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-green-100">
                                        {approved.map((req) => (
                                            <tr key={req.id}>
                                                <td className="px-6 py-4 text-green-800">{req.coach}</td>
                                                <td className="px-6 py-4 font-semibold">{req.sport}</td>
                                                <td className="px-6 py-4">{req.date}</td>
                                                <td className="px-6 py-4">{req.time}</td>
                                                <td className="px-6 py-4">{req.type}</td>
                                                <td className="px-6 py-4">{req.venue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Rejected Section */}
                    {rejected.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-red-700">
                                Rejected Sessions
                            </h2>
                            <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-sm">
                                <table className="min-w-full divide-y divide-red-100">
                                    <thead className="bg-red-100">
                                        <tr>
                                            {["Coach", "Sport", "Date", "Time", "Type", "Venue"].map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-700"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-red-100">
                                        {rejected.map((req) => (
                                            <tr key={req.id}>
                                                <td className="px-6 py-4 text-red-800">{req.coach}</td>
                                                <td className="px-6 py-4 font-semibold">{req.sport}</td>
                                                <td className="px-6 py-4">{req.date}</td>
                                                <td className="px-6 py-4">{req.time}</td>
                                                <td className="px-6 py-4">{req.type}</td>
                                                <td className="px-6 py-4">{req.venue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AdminScheduleRequests;
