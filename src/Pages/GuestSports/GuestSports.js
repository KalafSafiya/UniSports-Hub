import React, { useState, useEffect } from "react";
import Navbar from "../../GuestComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api"; //

function GuestSports() {
    const [sports, setSports] = useState([]); //
    const [selectedSport, setSelectedSport] = useState(null); 
    const [selectedTeam, setSelectedTeam] = useState(null);

    // Fetch approved sports from the database on component mount
    useEffect(() => {
        const fetchApprovedSports = async () => {
            try {
                const response = await api.get("/sports/approved"); //
                setSports(response.data); //
            } catch (error) {
                console.error("Error fetching sports:", error);
            }
        };
        fetchApprovedSports();
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <section className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                            Available Sports
                        </h2>

                        {/* Updated Sports Grid using database data */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {sports.map((sport) => (
                                <div
                                    key={sport.sport_id}
                                    className={`group flex flex-col gap-3 rounded-lg bg-white p-3 shadow-sm cursor-pointer hover:shadow-lg transition ${
                                        selectedSport?.sport_id === sport.sport_id ? "ring-2 ring-blue-500" : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedSport(sport); 
                                        setSelectedTeam(null); 
                                    }}
                                >
                                    <div
                                        className="w-full h-40 rounded-lg bg-cover bg-center bg-gray-200"
                                        style={{ 
                                            backgroundImage: sport.image ? `url(${sport.image})` : 'none' 
                                        }}
                                    >
                                        {!sport.image && (
                                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 uppercase text-sm text-center group-hover:underline">
                                            {sport.sport_name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Teams Section - Logic remains similar but uses DB schema */}
                        {selectedSport && selectedSport.teams && selectedSport.teams.length > 0 && (
                            <div className="mt-10 animate-in fade-in duration-300">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                    {selectedSport.sport_name} Teams
                                </h3>
                                <ul className="space-y-2">
                                    {selectedSport.teams.map((team, idx) => (
                                        <li
                                            key={idx}
                                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition"
                                            onClick={() => setSelectedTeam(team)}
                                        >
                                            {team.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Team Members Table */}
                        {selectedTeam && selectedTeam.members && (
                            <div className="mt-6 overflow-x-auto animate-in slide-in-from-bottom-4 duration-300">
                                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                    {selectedTeam.name} Members
                                </h4>
                                <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Faculty</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Year</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedTeam.members.map((member, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-2 text-sm text-gray-700">{member.name}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{member.role}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{member.faculty}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{member.year}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default GuestSports;
