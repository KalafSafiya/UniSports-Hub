import React, { useState, useEffect } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import { 
    getPendingSchedules,
    approveSchedule,
    rejectSchedule,
    getApprovedSchedules,
    getRejectedSchedules
} from '../../Services/scheduleService';

function AdminScheduleRequests() {
    // Mock data (replace later with data fetched from backend/localStorage)
    const [requests, setRequests] = useState([]);
    const [approved, setApproved] = useState([]);
    const [rejected, setRejected] = useState([]);

    const fetchPeningSchedules = async () => {
        try {
            const data = await getPendingSchedules();

            const formatted = data.map(s => ({
                id: s.schedule_id,
                coach: s.Sport?.coach?.name || 'N/A',
                sport: s.Sport?.sport_name,
                date: s.date,
                startTime: s.start_time,
                endTime: s.end_time,
                type: s.type,
                venue: s.Venue?.name,
                status: s.status
            }));

            setRequests(formatted);
        }
        catch (error) {
            console.error('Failed to load pending schedules');
        }
    }

    const fetchApprovedSchedules = async () => {
        try {
            const data = await getApprovedSchedules();

            const formatted = data.map(s => ({
                id: s.schedule_id,
                coach: s.Sport?.coach?.name || 'N/A',
                sport: s.Sport?.sport_name,
                date: s.date,
                startTime: s.start_time,
                endTime: s.end_time,
                type: s.type,
                venue: s.Venue?.name,
                status: s.status
            }));

            setApproved(formatted);
        }
        catch (error) {
            console.error('Failed to load approved schedules.');
        }
    }
    
    const fetchRejectedSchedules = async () => {
        try {
            const data = await getRejectedSchedules();

            const formatted = data.map(s => ({
                id: s.schedule_id,
                coach: s.Sport?.coach?.name || 'N/A',
                sport: s.Sport?.sport_name,
                date: s.date,
                startTime: s.start_time,
                endTime: s.end_time,
                type: s.type,
                venue: s.Venue?.name,
                status: s.status
            }));

            setRejected(formatted);
        }
        catch (error) {
            console.error('Failed to load approved schedules.');
        }
    }
    
    useEffect(() => {
        fetchPeningSchedules();
        fetchApprovedSchedules();
        fetchRejectedSchedules();
        // eslint-disable-next-line
    }, []);

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

    const handleApprove = async (req) => {
        try {
            await approveSchedule(req.id);
            fetchPeningSchedules();
            fetchApprovedSchedules();
        }
        catch (error) {
            alert(error.response?.data?.message || 'Approval failed');
        }
    };

    const handleReject = async (req) => {
        try {
            await rejectSchedule(req.id);
            fetchPeningSchedules();
            fetchRejectedSchedules();
        }
        catch (error) {
            alert(error.response?.data?.message || 'Rejection failed');
        }
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
                                                <td className="px-6 py-4 text-gray-700">{formatDate(req.date)}</td>
                                                <td className="px-6 py-4 text-gray-700">{`${formatTime(req.startTime)} - ${formatTime(req.endTime)}`}</td>
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
                                                <td className="px-6 py-4">{formatDate(req.date)}</td>
                                                <td className="px-6 py-4">{`${formatTime(req.startTime)} - ${formatTime(req.endTime)}`}</td>
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
                                                <td className="px-6 py-4">{formatDate(req.date)}</td>
                                                <td className="px-6 py-4">{`${formatTime(req.startTime)} - ${formatTime(req.endTime)}`}</td>
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
