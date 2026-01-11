import React, { useState } from "react";
import Navbar from "../../CoachComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import { sports as initialSports } from "../../Data/SportsData";

function CoachManageTeams() {
    const [sports, setSports] = useState([...initialSports]);
    const [selectedSportIndex, setSelectedSportIndex] = useState(null);

    const [showSportModal, setShowSportModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);

    const [newSportName, setNewSportName] = useState("");
    const [newSportImg, setNewSportImg] = useState("");

    const [teamForm, setTeamForm] = useState({ name: "", members: [] });
    const [editingTeamIndex, setEditingTeamIndex] = useState(null);

    /* ---------- SPORT ---------- */
    const handleAddSport = () => {
        if (!newSportName) return;
        setSports([...sports, { name: newSportName, img: newSportImg, teams: [] }]);
        setNewSportName("");
        setNewSportImg("");
        setShowSportModal(false);
    };

    /* ---------- TEAM ---------- */
    const handleSaveTeam = () => {
        if (!teamForm.name) return;

        const updatedSports = [...sports];
        if (editingTeamIndex !== null) {
            updatedSports[selectedSportIndex].teams[editingTeamIndex] = teamForm;
        } else {
            updatedSports[selectedSportIndex].teams.push(teamForm);
        }

        setSports(updatedSports);
        setTeamForm({ name: "", members: [] });
        setEditingTeamIndex(null);
        setShowTeamModal(false);
    };

    const handleRemoveTeam = (idx) => {
        const updatedSports = [...sports];
        updatedSports[selectedSportIndex].teams.splice(idx, 1);
        setSports(updatedSports);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6">Coach Manage Teams</h1>

                    {/* ACTIONS */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setShowSportModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Add Sport
                        </button>

                        <button
                            disabled={selectedSportIndex === null}
                            onClick={() => {
                                setTeamForm({ name: "", members: [] });
                                setEditingTeamIndex(null);
                                setShowTeamModal(true);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                        >
                            Add Team
                        </button>
                    </div>

                    {/* SPORTS LIST */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sports.map((sport, sIdx) => (
                            <div
                                key={sIdx}
                                onClick={() => setSelectedSportIndex(sIdx)}
                                className={`p-4 rounded shadow cursor-pointer ${selectedSportIndex === sIdx
                                    ? "border-2 border-blue-500"
                                    : "border"
                                    }`}
                            >
                                <div
                                    className="h-32 bg-cover bg-center rounded mb-2"
                                    style={{ backgroundImage: `url(${sport.img})` }}
                                />
                                <h3 className="font-semibold">{sport.name}</h3>

                                {selectedSportIndex === sIdx &&
                                    sport.teams.map((team, tIdx) => (
                                        <div
                                            key={tIdx}
                                            className="flex justify-between bg-gray-100 p-2 rounded mt-2"
                                        >
                                            <span>{team.name}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    className="text-blue-600 text-sm"
                                                    onClick={() => {
                                                        setTeamForm(team);
                                                        setEditingTeamIndex(tIdx);
                                                        setShowTeamModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-600 text-sm"
                                                    onClick={() => handleRemoveTeam(tIdx)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* ADD SPORT MODAL */}
            {showSportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-xl font-semibold mb-4">Add Sport</h3>
                        <input
                            className="w-full p-2 mb-3 border rounded"
                            placeholder="Sport Name"
                            value={newSportName}
                            onChange={(e) => setNewSportName(e.target.value)}
                        />
                        <input
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Image URL"
                            value={newSportImg}
                            onChange={(e) => setNewSportImg(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowSportModal(false)}
                                className="bg-gray-400 px-3 py-1 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSport}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD / EDIT TEAM MODAL */}
            {showTeamModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-2xl">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingTeamIndex !== null ? "Edit Team" : "Add Team"}
                        </h3>

                        <input
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Team Name"
                            value={teamForm.name}
                            onChange={(e) =>
                                setTeamForm({ ...teamForm, name: e.target.value })
                            }
                        />

                        <h4 className="font-semibold mb-2">Members</h4>

                        {teamForm.members.map((m, idx) => (
                            <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
                                <input
                                    className="border p-1 rounded col-span-2"
                                    placeholder="Name"
                                    value={m.name}
                                    onChange={(e) => {
                                        const members = [...teamForm.members];
                                        members[idx].name = e.target.value;
                                        setTeamForm({ ...teamForm, members });
                                    }}
                                />
                                <input
                                    className="border p-1 rounded"
                                    placeholder="Role"
                                    value={m.role}
                                    onChange={(e) => {
                                        const members = [...teamForm.members];
                                        members[idx].role = e.target.value;
                                        setTeamForm({ ...teamForm, members });
                                    }}
                                />
                                <input
                                    className="border p-1 rounded"
                                    placeholder="Faculty"
                                    value={m.faculty}
                                    onChange={(e) => {
                                        const members = [...teamForm.members];
                                        members[idx].faculty = e.target.value;
                                        setTeamForm({ ...teamForm, members });
                                    }}
                                />
                                <input
                                    className="border p-1 rounded"
                                    placeholder="Year"
                                    value={m.year}
                                    onChange={(e) => {
                                        const members = [...teamForm.members];
                                        members[idx].year = e.target.value;
                                        setTeamForm({ ...teamForm, members });
                                    }}
                                />
                                <button
                                    className="text-red-600 text-sm"
                                    onClick={() => {
                                        const members = [...teamForm.members];
                                        members.splice(idx, 1);
                                        setTeamForm({ ...teamForm, members });
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() =>
                                setTeamForm({
                                    ...teamForm,
                                    members: [
                                        ...teamForm.members,
                                        { name: "", role: "", faculty: "", year: "" },
                                    ],
                                })
                            }
                            className="mb-4 px-3 py-1 bg-green-600 text-white rounded"
                        >
                            + Add Member
                        </button>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowTeamModal(false)}
                                className="bg-gray-400 px-4 py-1 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTeam}
                                className="bg-blue-600 text-white px-4 py-1 rounded"
                            >
                                Save Team
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default CoachManageTeams;
