import React, { useState } from "react";
import Navbar from "../../CoachComponents/NavBar";
import Footer from "../../GuestComponents/Footer";

const venues = [
    "Outdoor Ground",
    "Indoor Sports Complex",
    "Basketball Court",
    "Tennis Court",
    "Badminton Hall",
    "Cricket Nets",
    "Football Field",
];

// Approved sessions (displayed to coach)
const approvedSchedules = [
    { sport: "Football", startTime: "14:00", endTime: "16:00", type: "Match", venue: "Outdoor Ground", date: "2025-11-05", status: "Approved" },
];

// Pending requests (not yet approved)
const initialPendingRequests = [
    { sport: "Basketball", startTime: "10:00", endTime: "12:00", type: "Practice", venue: "Basketball Court" },
];

function CoachManageSchedule() {
    const [schedules, setSchedules] = useState(approvedSchedules);
    const [pendingRequests, setPendingRequests] = useState(initialPendingRequests);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newSession, setNewSession] = useState({ sport: "", date: "", startTime: "", endTime: "", type: "Practice", venue: "" });
    const [editingSession, setEditingSession] = useState(null);
    const [showRequestSent, setShowRequestSent] = useState(false);

    /* ---------- MERGE APPROVED + PENDING FOR DISPLAY ---------- */
    const allSessions = [
        ...schedules,
        ...pendingRequests.map(req => ({ ...req, status: "Pending" }))
    ];

    /* ---------- SEND NEW SESSION REQUEST ---------- */
    const handleSendSessionRequest = () => {
        if (!newSession.sport || !newSession.date || !newSession.startTime || !newSession.endTime || !newSession.venue) return;

        setPendingRequests([...pendingRequests, { ...newSession }]);
        console.log("SESSION REQUEST SENT:", newSession);

        setNewSession({ sport: "", date: "", startTime: "", endTime: "", type: "Practice", venue: "" });
        setShowAddForm(false);
        setShowRequestSent(true);
    };

    /* ---------- SEND EDIT SESSION REQUEST ---------- */
    const handleSendEditSessionRequest = () => {
        const updatedRequest = { ...editingSession };
        delete updatedRequest.idx; // remove index before sending
        setPendingRequests([...pendingRequests, updatedRequest]);
        console.log("EDIT SESSION REQUEST SENT:", updatedRequest);
        setEditingSession(null);
        setShowRequestSent(true);
    };

    /* ---------- REMOVE APPROVED SESSION ---------- */
    const handleRemoveSession = (idx) => {
        if (window.confirm("Remove this session?")) {
            const updated = [...schedules];
            updated.splice(idx, 1);
            setSchedules(updated);
        }
    };

    /* ---------- OPEN EDIT FORM ---------- */
    const openEditModal = (idx) => {
        setEditingSession({ ...schedules[idx], idx });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="mx-auto max-w-6xl px-4">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Coach Manage Schedules</h1>
                        <p className="mt-2 text-gray-600">
                            Create or edit sessions. All new sessions or edits are sent as requests to admin for approval.
                        </p>
                    </div>

                    <div className="mb-6 flex justify-center">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            Add New Session
                        </button>
                    </div>

                    {/* ===== ADD FORM ===== */}
                    {showAddForm && (
                        <div className="mb-6 bg-white p-4 rounded shadow-md max-w-md mx-auto">
                            <h3 className="font-semibold mb-2">Request New Session</h3>
                            <input
                                type="text"
                                placeholder="Sport"
                                value={newSession.sport}
                                onChange={e => setNewSession({ ...newSession, sport: e.target.value })}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="date"
                                value={newSession.date}
                                onChange={e => setNewSession({ ...newSession, date: e.target.value })}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="time"
                                    value={newSession.startTime}
                                    onChange={e => setNewSession({ ...newSession, startTime: e.target.value })}
                                    className="w-1/2 p-2 border rounded"
                                />
                                <input
                                    type="time"
                                    value={newSession.endTime}
                                    onChange={e => setNewSession({ ...newSession, endTime: e.target.value })}
                                    className="w-1/2 p-2 border rounded"
                                />
                            </div>
                            <select
                                value={newSession.type}
                                onChange={e => setNewSession({ ...newSession, type: e.target.value })}
                                className="w-full p-2 border rounded mb-2"
                            >
                                <option value="Practice">Practice</option>
                                <option value="Match">Match</option>
                            </select>
                            <select
                                value={newSession.venue}
                                onChange={e => setNewSession({ ...newSession, venue: e.target.value })}
                                className="w-full p-2 border rounded mb-2"
                            >
                                <option value="">Select Venue</option>
                                {venues.map(v => <option key={v}>{v}</option>)}
                            </select>

                            <button
                                onClick={handleSendSessionRequest}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                                Send Request
                            </button>
                        </div>
                    )}

                    {/* ===== TABLE ===== */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md mb-12">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    {["Sport", "Date", "Time", "Type", "Venue", "Status", "Actions"].map(header => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allSessions.map((s, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{s.sport}</td>
                                        <td className="px-6 py-4 text-gray-700">{s.date}</td>
                                        <td className="px-6 py-4 text-gray-700">{`${s.startTime} - ${s.endTime}`}</td>
                                        <td className={`px-6 py-4 font-semibold ${s.type === "Match" ? "text-green-600" : "text-blue-600"}`}>{s.type}</td>
                                        <td className="px-6 py-4 text-gray-700">{s.venue}</td>
                                        <td className={`px-6 py-4 font-semibold ${s.status === "Pending" ? "text-yellow-500" : s.status === "Approved" ? "text-green-600" : "text-red-600"}`}>
                                            {s.status || "Pending"}
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {s.status === "Approved" && (
                                                <>
                                                    <button className="text-blue-600 text-sm" onClick={() => openEditModal(i)}>Edit</button>
                                                    <button className="text-red-600 text-sm" onClick={() => handleRemoveSession(i)}>Remove</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ===== EDIT FORM ===== */}
                    {editingSession && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded shadow-md w-96">
                                <h3 className="text-lg font-semibold mb-2">Request Edit: {editingSession.sport}</h3>

                                <input
                                    type="text"
                                    value={editingSession.sport}
                                    onChange={e => setEditingSession({ ...editingSession, sport: e.target.value })}
                                    className="w-full p-2 border rounded mb-2"
                                />
                                <input
                                    type="date"
                                    value={editingSession.date}
                                    onChange={e => setEditingSession({ ...editingSession, date: e.target.value })}
                                    className="w-full p-2 border rounded mb-2"
                                />
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="time"
                                        value={editingSession.startTime}
                                        onChange={e => setEditingSession({ ...editingSession, startTime: e.target.value })}
                                        className="w-1/2 p-2 border rounded"
                                    />
                                    <input
                                        type="time"
                                        value={editingSession.endTime}
                                        onChange={e => setEditingSession({ ...editingSession, endTime: e.target.value })}
                                        className="w-1/2 p-2 border rounded"
                                    />
                                </div>
                                <select
                                    value={editingSession.type}
                                    onChange={e => setEditingSession({ ...editingSession, type: e.target.value })}
                                    className="w-full p-2 border rounded mb-2"
                                >
                                    <option value="Practice">Practice</option>
                                    <option value="Match">Match</option>
                                </select>
                                <select
                                    value={editingSession.venue}
                                    onChange={e => setEditingSession({ ...editingSession, venue: e.target.value })}
                                    className="w-full p-2 border rounded mb-2"
                                >
                                    {venues.map(v => <option key={v}>{v}</option>)}
                                </select>

                                <div className="flex justify-end gap-2">
                                    <button className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-500 text-white" onClick={() => setEditingSession(null)}>Cancel</button>
                                    <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendEditSessionRequest}>Send Edit Request</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== REQUEST SENT MODAL ===== */}
                    {showRequestSent && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded w-80 text-center">
                                <h3 className="text-xl font-semibold mb-4">Request Sent!</h3>
                                <p>Your session request has been sent to the admin for approval.</p>
                                <button
                                    onClick={() => setShowRequestSent(false)}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CoachManageSchedule;
