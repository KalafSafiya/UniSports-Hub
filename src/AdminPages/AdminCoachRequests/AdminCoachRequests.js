import React, { useState } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";

function AdminCoachRequests() {
    const [requests, setRequests] = useState([
        {
            id: 1,
            coach: "Coach Silva",
            sport: "Basketball",
            type: "Team Request",
            teamName: "Vavuniya Kings",
            members: [
                { name: "John", role: "Captain", faculty: "Science", year: "3rd" },
                { name: "Aruna", role: "Player", faculty: "IT", year: "2nd" },
            ],
        },
        {
            id: 2,
            coach: "Coach Priya",
            sport: "Volleyball",
            type: "New Sport",
            details: "Wants to introduce Mixed Volleyball league",
        },
    ]);

    const [approved, setApproved] = useState([]);
    const [rejected, setRejected] = useState([]);

    const handleApprove = (req) => {
        setApproved([...approved, req]);
        setRequests(requests.filter((r) => r.id !== req.id));
    };

    const handleReject = (req) => {
        setRejected([...rejected, req]);
        setRequests(requests.filter((r) => r.id !== req.id));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Coach Schedule Requests
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Review and manage new team or sport requests submitted by coaches.
                    </p>

                    {/* Pending Requests */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
                        {requests.length === 0 ? (
                            <p className="text-gray-500">No pending requests.</p>
                        ) : (
                            <div className="space-y-4">
                                {requests.map((req) => (
                                    <div key={req.id} className="bg-white rounded-lg shadow p-5 border">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {req.type === "Team Request" ? `Team: ${req.teamName}` : `New Sport: ${req.sport}`}
                                                </h3>
                                                <p className="text-gray-600">Coach: {req.coach}</p>
                                                <p className="text-gray-600">Sport: {req.sport}</p>
                                                {req.details && (
                                                    <p className="text-gray-700 mt-1">{req.details}</p>
                                                )}
                                                {req.members && (
                                                    <ul className="mt-3 border-t pt-2 text-sm text-gray-700">
                                                        {req.members.map((m, idx) => (
                                                            <li key={idx} className="flex justify-between">
                                                                <span>{m.name} ({m.role})</span>
                                                                <span className="text-gray-500">{m.faculty}, {m.year}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Approved */}
                    {approved.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold mb-4 text-green-700">Approved Requests</h2>
                            <div className="space-y-3">
                                {approved.map((req) => (
                                    <div key={req.id} className="bg-green-50 border p-4 rounded">
                                        <strong>{req.teamName || req.sport}</strong> approved from {req.coach}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Rejected */}
                    {rejected.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-red-700">Rejected Requests</h2>
                            <div className="space-y-3">
                                {rejected.map((req) => (
                                    <div key={req.id} className="bg-red-50 border p-4 rounded">
                                        <strong>{req.teamName || req.sport}</strong> rejected from {req.coach}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AdminCoachRequests;
