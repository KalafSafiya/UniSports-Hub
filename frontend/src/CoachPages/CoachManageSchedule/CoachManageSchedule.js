import React, { useState, useEffect } from "react";
import Navbar from "../../CoachComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import {
    getMySchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from '../../Services/scheduleService';
import {
    getAllVenues
} from '../../Services/venueService'
import {
    getMyApprovedSports
} from '../../Services/sportService'

function CoachManageSchedule() {
    const [venues, setVenues] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [sports, setSports] = useState([]);
    const [timeError, setTimeError] = useState("");

    useEffect(() => {
        fetchVenues();
        fetchMySports();
        fetchMySchedules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const fetchVenues = async () => {
        try {
            const data = await getAllVenues();
            setVenues(Array.isArray(data) ? data : []);
        }
        catch (error) {
            console.error("Error fetching venues: ", error);
        }
    }

    const formatTime = (timeString) => {
        const date = new Date(`1970-01-01T${timeString}`);

        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`
    }

    const fetchMySchedules = async () => {
        try {
            const data = await getMySchedules();

            const formatted = data.map(s => ({
                id: s.schedule_id,
                sport_id: s.sport_id,
                sport: s.Sport?.sport_name,
                venue_id: s.venue_id,
                venue: s.Venue?.name,
                date: formatDate(s.date),
                startTime: s.start_time,
                endTime: s.end_time,
                type: s.type,
                status: s.status
            }));

            setSchedules(formatted);
        }
        catch (error) {
            console.error('Error fetching schedules: ', error);
        }
    }

    const fetchMySports = async () => {
        try {
            const data = await getMyApprovedSports();
            setSports(Array.isArray(data) ? data : []);
        }
        catch (error) {
            console.error('Error fetching sports: ', error);
        }
    }


    const [showAddForm, setShowAddForm] = useState(false);
    const [newSession, setNewSession] = useState({ sport: "", date: "", startTime: "", endTime: "", type: "Practice", venue: "" });
    const [editingSession, setEditingSession] = useState(null);
    const [showRequestSent, setShowRequestSent] = useState(false);

    /* ---------- SEND NEW SESSION REQUEST ---------- */
    const handleSendSessionRequest = async () => {
        if (!newSession.sport || !newSession.date || !newSession.startTime || !newSession.endTime || !newSession.venue) return;

        if (newSession.endTime <= newSession.startTime) {
            setTimeError("End time must be after start time.");
            return;
        }

        try {
            await createSchedule({
                sport_id: newSession.sport,
                venue_id: newSession.venue,
                date: newSession.date,
                start_time: newSession.startTime + ":00",
                end_time: newSession.endTime + ":00",
                type: newSession.type
            });

            await fetchMySchedules();

            console.log("Sending schedule:", {
                sport_id: newSession.sport,
                venue_id: newSession.venue,
                date: newSession.date,
                start_time: newSession.startTime,
                end_time: newSession.endTime,
                type: newSession.type
            });

            setShowAddForm(false);
            setShowRequestSent(true);
            setNewSession({ sport: "", date: "", startTime: "", endTime: "", type: "Practice", venue: "" });
            setTimeError("");
        }
        catch (error) {
            console.error("Create schedule failed: ", error);
        }
    };

    /* ---------- SEND EDIT SESSION REQUEST ---------- */
    const handleSendEditSessionRequest = async () => {
        if (editingSession.end_time <= editingSession.start_time) {
            setTimeError("End time must be after start time.");
            return;
        }
        else {
            setTimeError("");
        }

        if (
            !editingSession.sport_id ||
            !editingSession.venue_id ||
            !editingSession.date ||
            !editingSession.start_time ||
            !editingSession.end_time
        ) {
            alert('All fields are required');
            return;
        }

        try {
            await updateSchedule(editingSession.id, {
                sport_id: editingSession.sport_id,
                venue_id: editingSession.venue_id,
                date: editingSession.date,
                start_time: editingSession.start_time + ':00',
                end_time: editingSession.end_time + ':00',
                type: editingSession.type
            });

            await fetchMySchedules();
            setEditingSession(null);
            setShowRequestSent(true);
        }
        catch (error) {
            console.error('Edit schedule failed: ', error);
        }
    }


    /* ---------- REMOVE APPROVED SESSION ---------- */
    const handleRemoveSession = async (idx) => {
        const schedule = schedules[idx];

        if (!window.confirm("Remove this session? ")) {
            return
        }

        try {
            await deleteSchedule(schedule.id);
            await fetchMySchedules();
        }
        catch (error) {
            console.error('Delete schedule failed: ', error);
            alert(error.response?.data.message || 'Failed to remove schedule')
        }
    };

    /* ---------- OPEN EDIT FORM ---------- */
    const openEditModal = (idx) => {
        const s = schedules[idx];

        setEditingSession({
            id: s.id,
            sport_id: s.sport_id,
            venue_id: s.venue_id,
            date: s.date,
            start_time: s.startTime,
            end_time: s.endTime,
            type: s.type
        });
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
                             <select
                                value={newSession.sport}
                                onChange={e => setNewSession({ ...newSession, sport: e.target.value })}
                                className="w-full p-2 border rounded mb-2"
                            >
                                <option value=""> Select Sport </option>
                                {sports.map(s => (
                                    <option key={s.sport_id} value={s.sport_id}>
                                        {s.sport_name}
                                    </option>
                                ))}
                            </select>
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
                                    onChange={e => {
                                        const start = e.target.value;

                                        let end = newSession.endTime;
                                        if (!end || end <= start) {
                                            const [h, m] = start.split(":");
                                            end = `${String(Number(h) + 1).padStart(2, '0')}:${m}`;
                                        }

                                        setNewSession({ ...newSession, startTime: start, endTime: end })
                                    }}
                                    className="w-1/2 p-2 border rounded"
                                />
                                <input
                                    type="time"
                                    value={newSession.endTime}
                                    min = {newSession.startTime}
                                    onChange={e => setNewSession({ ...newSession, endTime: e.target.value })}
                                    className="w-1/2 p-2 border rounded"
                                />
                                {timeError && (
                                    <p className="text-red-500 text-sm mb-2"> {timeError} </p>
                                )}
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
                                {venues.map(v => (
                                    <option key={v.venue_id} value={v.venue_id}>
                                        {v.name}
                                    </option>
                                ))}
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
                                {schedules.map((s, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{s.sport}</td>
                                        <td className="px-6 py-4 text-gray-700">{s.date}</td>
                                        <td className="px-6 py-4 text-gray-700">{`${formatTime(s.startTime)} - ${formatTime(s.endTime)}`}</td>
                                        <td className={`px-6 py-4 font-semibold ${s.type === "Match" ? "text-green-600" : "text-blue-600"}`}>{s.type}</td>
                                        <td className="px-6 py-4 text-gray-700">{s.venue}</td>
                                        <td className={`px-6 py-4 font-semibold ${s.status === "Pending" ? "text-yellow-500" : s.status === "Approved" ? "text-green-600" : "text-red-600"}`}>
                                            {s.status || "Pending"}
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                        {s.status !== 'Approved' && (
                                            <button disabled={s.status === 'Approved'} className="text-blue-600 text-sm" onClick={() => openEditModal(i)}>Edit</button>
                                        )}
                                        {s.status !== 'Approved' && (
                                            <button disabled={s.status === 'Approved'} className="text-red-600 text-sm" onClick={() => handleRemoveSession(i)}>Remove</button>
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
                                <h3 className="text-lg font-semibold mb-2">Request Edit: {sports.find(s => s.sport_id === editingSession.sport_id)?.sport_name} </h3>

                                <select
                                    value={editingSession.sport_id}
                                    onChange={e => setEditingSession({ ...editingSession, sport_id: e.target.value })}
                                    className="w-full p-2 border rounded mb-2"
                                >
                                    <option value=""> Select Sport </option>
                                    {sports.map(s => (
                                        <option key={s.sport_id} value={s.sport_id}> {s.sport_name} </option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    value={editingSession.date}
                                    onChange={e => setEditingSession({ ...editingSession, date: e.target.value })}
                                    className="w-full p-2 border rounded mb-2"
                                />
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="time"
                                        value={editingSession.start_time}
                                        onChange={e => {
                                            const start = e.target.value;
                                            let end = editingSession.end_time;

                                            if (!end || end <= start) {
                                                const [h, m] = start.split(":");
                                                end = `${String(Number(h) + 1).padStart(2, '0')}:${m}`;
                                            }

                                            if (end && end <= start) {
                                                setTimeError('End time must be after start time')
                                            }
                                            else {
                                                setTimeError('');
                                            }

                                            setEditingSession({ ...editingSession, start_time: start, end_time: end });
                                        }}
                                        className="w-1/2 p-2 border rounded"
                                    />
                                    <input
                                        type="time"
                                        value={editingSession.end_time}
                                        min={editingSession.start_time}
                                        onChange={e => setEditingSession({ ...editingSession, end_time: e.target.value })}
                                        className="w-1/2 p-2 border rounded"
                                    />
                                    {timeError && (
                                        <p className="text-red-500 text-sm mb-2"> {timeError} </p>
                                    )}
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
                                    value={editingSession.venue_id}
                                    onChange={e => setEditingSession({ ...editingSession, venue_id: e.target.value })}
                                    className="w-full p-2 border rounded mb-2"
                                >
                                    <option value=""> Select Venue </option>
                                    {venues.map(v => (
                                        <option key={v.venue_id} value={v.venue_id}> {v.name} </option>
                                    ))}
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