import React, { useState, useEffect } from "react";
import Navbar from "../../GuestComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api";

/* ================= HELPER ================= */
const sortMembersByRole = (members = []) => {
    const order = {
        "Captain": 1,
        "Vice Captain": 2,
        "Player": 3
    };

    return [...members].sort(
        (a, b) => (order[a.role] || 99) - (order[b.role] || 99)
    );
};

/* ================= COMPONENT ================= */
function GuestSports() {
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);

    /* ---------- FETCH SPORTS ---------- */
    useEffect(() => {
        const fetchSports = async () => {
            try {
                const res = await api.get("/sports/approved");
                setSports(res.data);
            } catch (error) {
                console.error("Error fetching sports:", error);
            }
        };

        fetchSports();
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-grow pt-20">
                <div className="mx-auto max-w-7xl px-4">

                    {/* ===== HEADER ===== */}
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                        Available Sports
                    </h2>

                    {/* ===== SPORTS GRID ===== */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        {sports.map((sport) => (
                            <div
                                key={sport.sport_id}
                                onClick={() => {
                                    setSelectedSport(sport);
                                    setSelectedTeam(null);
                                }}
                                className={`cursor-pointer rounded-lg bg-white p-3 shadow-sm hover:shadow-lg transition ${
                                    selectedSport?.sport_id === sport.sport_id
                                        ? "ring-2 ring-blue-500"
                                        : ""
                                }`}
                            >
                                <div
                                    className="h-40 w-full rounded-lg bg-gray-200 bg-cover bg-center"
                                    style={{
                                        backgroundImage: sport.image
                                            ? `url(${sport.image})`
                                            : "none"
                                    }}
                                >
                                    {!sport.image && (
                                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <p className="mt-3 text-center text-sm font-semibold uppercase text-gray-800">
                                    {sport.sport_name}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ===== TEAMS LIST ===== */}
                    {selectedSport && selectedSport.Teams?.length > 0 && (
                        <div className="mt-10">
                            <h3 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                                {selectedSport.sport_name} Teams
                            </h3>

                            <ul className="space-y-2">
                                {selectedSport.Teams.map((team) => (
                                    <li
                                        key={team.team_id}
                                        onClick={() => setSelectedTeam(team)}
                                        className={`cursor-pointer text-blue-600 hover:text-blue-800 hover:underline ${
                                            selectedTeam?.team_id === team.team_id
                                                ? "font-bold"
                                                : ""
                                        }`}
                                    >
                                        {team.team_name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ===== TEAM MEMBERS TABLE ===== */}
                    {selectedTeam && selectedTeam.TeamMembers?.length > 0 && (
                        <div className="mt-8 overflow-x-auto">

                            {/* TEAM NAME */}
                            <h4 className="mb-4 text-xl font-bold text-gray-800">
                                {selectedTeam.team_name}
                            </h4>

                            <table className="min-w-full overflow-hidden rounded-lg border divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                            Position
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                            Player Name
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                            Registration No
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
                                    {sortMembersByRole(
                                        selectedTeam.TeamMembers
                                    ).map((member, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-2 font-semibold text-gray-700">
                                                {member.role}
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {member.member_name}
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {member.registration_number}
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {member.faculty}
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {member.year}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}

export default GuestSports;
