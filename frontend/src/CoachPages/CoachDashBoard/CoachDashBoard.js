import React, { useEffect, useState } from "react";
import Navbar from "../../CoachComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import { getApprovedSportsWithTeamsById } from "../../Services/sportService";
import { getMySchedules } from '../../Services/scheduleService';

function CoachDashboard() {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);

    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
            fetchMySchedules();
            // eslint-disable-next-line react-hooks/exhaustive-deps
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

        const fetchMySchedules = async () => {
            try {
                const data = await getMySchedules();
    
                const formatted = data.map(s => ({
                    id: s.schedule_id,
                    type: s.type,
                    sport: s.Sport.sport_name,
                    date: formatDate(s.date),
                    time: `${formatTime(s.start_time)} - ${formatTime(s.end_time)}`,
                    venue: s.Venue.name,
                    status: s.status
                }));
    
                setSchedules(formatted);
            }
            catch (error) {
                console.error('Error fetching schedules: ', error);
            }
        }

    const pendingSessions = schedules.filter(s => s.status === "Pending").length;
    const approvedSessions = schedules.filter(s => s.status === "Approved").length;
    const totalSessions = schedules.length;

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await getApprovedSportsWithTeamsById();
                setSports(data);
            } catch (error) {
                console.error("Failed to load coach teams", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 justify-items-center">
                        {[
                            { label: "Pending Sessions", value: pendingSessions },
                            { label: "Approved Sessions", value: approvedSessions },
                            { label: "Total Sessions", value: totalSessions },
                        ].map(card => (
                            <div key={card.label} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center w-full max-w-xs">
                                <p className="text-gray-500 font-semibold">{card.label}</p>
                                <p className="text-2xl font-bold">{card.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Team Members */}
                    {loading ? (
                        <p className="text-center text-gray-500">Loading teams...</p>
                    ) : sports.length === 0 ? (
                        <p className="text-center text-gray-500">No approved teams found.</p>
                    ) : (
                        sports.map(sport => (
                            <div key={sport.sport_id} className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                                <h2 className="text-xl font-bold p-4 border-b">
                                    {sport.sport_name} – Team Members
                                </h2>

                                {sport.Teams.map(team => (
                                    <div key={team.team_id} className="overflow-x-auto">
                                        <h3 className="font-semibold px-4 pt-4">
                                            {team.team_name}
                                        </h3>

                                        <table className="min-w-full mt-2 divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    {["Name", "Reg No", "Role", "Faculty", "Year"].map(h => (
                                                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y">
                                                {team.TeamMembers.map((m, i) => (
                                                    <tr key={i}>
                                                        <td className="px-6 py-4">{m.member_name}</td>
                                                        <td className="px-6 py-4">{m.registration_number}</td>
                                                        <td className="px-6 py-4">{m.role}</td>
                                                        <td className="px-6 py-4">{m.faculty}</td>
                                                        <td className="px-6 py-4">{m.year}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}

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
                                {schedules.map(session => (
                                    <tr key={session.id}>
                                        <td className={`px-6 py-4 font-semibold ${session.type === "Match" ? "text-green-600" : "text-blue-600"}`}>{session.type}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{session.sport}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{session.date}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{session.time}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{session.venue}</td>
                                        <td className={`px-6 py-4 font-semibold ${ session.status === "Pending" ? "text-yellow-500" : session.status === "Approved" ? "text-green-600" : session.status === "Rejected" ? "text-red-600" : "text-gray-500"}`}> {session.status} </td>
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
