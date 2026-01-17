import React, { useState } from "react";
import Navbar from "../../GuestComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import { sports } from "../../Data/SportsData";

function GuestSports() {
    const [selectedSport, setSelectedSport] = useState(null); // Initially no sport selected
    const [selectedTeam, setSelectedTeam] = useState(null);

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <section className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                            Available Sports
                        </h2>

                        {/* Sports Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {sports.map((sport, i) => (
                                <div
                                    key={i}
                                    className="group flex flex-col gap-3 rounded-lg bg-white p-3 shadow-sm cursor-pointer hover:shadow-lg transition"
                                    onClick={() => {
                                        setSelectedSport(sport); // Set selected sport
                                        setSelectedTeam(null); // Reset selected team
                                    }}
                                >
                                    <div
                                        className="w-full h-40 rounded-lg bg-cover bg-center"
                                        style={{ backgroundImage: `url(${sport.img})` }}
                                    ></div>
                                    <div>
                                        <p className="font-semibold text-black-600 hover:underline">
                                            {sport.name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Teams */}
                        {selectedSport && selectedSport.teams && (
                            <div className="mt-10">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    {selectedSport.name} Teams
                                </h3>
                                <ul className="space-y-2">
                                    {selectedSport.teams.map((team, idx) => (
                                        <li
                                            key={idx}
                                            className="text-black-600 hover:underline cursor-pointer"
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
                            <div className="mt-6 overflow-x-auto">
                                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                    {selectedTeam.name} Members
                                </h4>
                                <table className="min-w-full divide-y divide-gray-200 border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                                Name
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                                Role
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                                Faculty
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                                Year
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedTeam.members.map((member, idx) => (
                                            <tr key={idx}>
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
