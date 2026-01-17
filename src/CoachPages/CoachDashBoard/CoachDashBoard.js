import React, { useState } from "react";
import Navbar from "../../CoachComponents/NavBar";
import Footer from "../../GuestComponents/Footer";

// Mock Data
const initialTeamMembers = [
    { id: 1, name: "John Doe", universityId: "2021/ICT/001", role: "Player", position: "Forward" },
    { id: 2, name: "Jane Smith", universityId: "2021/ICT/002", role: "Player", position: "Goalkeeper" },
];

const initialSessions = [
    { id: 1, type: "Practice", sport: "Basketball", date: "2025-11-03", time: "6:00 AM - 8:00 AM", venue: "Basketball Court", status: "Pending" },
    { id: 2, type: "Match", sport: "Football", date: "2025-11-05", time: "10:00 AM - 12:00 PM", venue: "Outdoor Ground", status: "Approved" },
];

function CoachDashboard() {
    const [teamMembers] = useState(initialTeamMembers);
    const [sessions] = useState(initialSessions);

    const totalMembers = teamMembers.length;
    const pendingSessions = sessions.filter(s => s.status === "Pending").length;
    const approvedSessions = sessions.filter(s => s.status === "Approved").length;
    const totalSessions = sessions.length;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coach Dashboard</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Overview of your team and session activities
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                            <p className="text-gray-500 dark:text-gray-400 font-semibold">Team Members</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMembers}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                            <p className="text-gray-500 dark:text-gray-400 font-semibold">Pending Sessions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingSessions}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                            <p className="text-gray-500 dark:text-gray-400 font-semibold">Approved Sessions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedSessions}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                            <p className="text-gray-500 dark:text-gray-400 font-semibold">Total Sessions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSessions}</p>
                        </div>
                    </div>

                    {/* Team Members Table */}
                    <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
                        <h2 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-gray-700">Team Members</h2>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    {["Name", "University ID", "Role", "Position"].map(header => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {teamMembers.map(member => (
                                    <tr key={member.id}>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white">{member.name}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{member.universityId}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{member.role}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{member.position}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Scheduled Sessions Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
                        <h2 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-gray-700">Scheduled Sessions</h2>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    {["Type", "Sport", "Date", "Time", "Venue", "Status"].map(header => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {sessions.map(session => (
                                    <tr key={session.id}>
                                        <td className={`px-6 py-4 font-semibold ${session.type === "Match" ? "text-green-600" : "text-blue-600"}`}>{session.type}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{session.sport}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{session.date}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{session.time}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{session.venue}</td>
                                        <td className={`px-6 py-4 font-semibold ${session.status === "Pending" ? "text-yellow-500" : "text-green-600"}`}>{session.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

export default CoachDashboard;
