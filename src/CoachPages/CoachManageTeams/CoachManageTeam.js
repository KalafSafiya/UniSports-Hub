import React, { useState } from "react";
import Navbar from "../../CoachComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import { sports as approvedSports } from "../../Data/SportsData";

function CoachManageTeams() {
    // Approved sports & teams (shown to coach)
    const [sports, setSports] = useState(approvedSports);

    // Selected sport to show teams
    const [selectedSportIndex, setSelectedSportIndex] = useState(null);

    // Modals
    const [showSportModal, setShowSportModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showRequestSent, setShowRequestSent] = useState(false);

    // SPORT REQUEST FORM
    const [sportForm, setSportForm] = useState({ name: "", description: "" });

    // TEAM FORM
    const [teamForm, setTeamForm] = useState({ name: "", members: [] });
    const [editingTeamIndex, setEditingTeamIndex] = useState(null);

    // Pending team requests (not displayed until admin approves)
    const [pendingTeamRequests, setPendingTeamRequests] = useState([]);

    /* ---------- SEND SPORT REQUEST ---------- */
    const handleSendSportRequest = () => {
        if (!sportForm.name) return;

        // Send request to admin (simulation)
        console.log("SPORT REQUEST SENT:", sportForm);

        setShowSportModal(false);
        setShowRequestSent(true);
        setSportForm({ name: "", description: "" });
    };

    /* ---------- SEND TEAM REQUEST ---------- */
    const handleSendTeamRequest = () => {
        if (!teamForm.name || selectedSportIndex === null) return;

        // Save request to pending list
        const newRequest = {
            sportId: sports[selectedSportIndex].id,
            sportName: sports[selectedSportIndex].name,
            team: teamForm,
        };

        setPendingTeamRequests([...pendingTeamRequests, newRequest]);
        console.log("TEAM REQUEST SENT (pending):", newRequest);

        setTeamForm({ name: "", members: [] });
        setShowTeamModal(false);
        setShowRequestSent(true);
        setEditingTeamIndex(null);
    };

    /* ---------- EDIT / REMOVE APPROVED TEAM ---------- */
    const handleRemoveTeam = (teamIdx) => {
        if (selectedSportIndex === null) return;
        const updatedSports = [...sports];
        updatedSports[selectedSportIndex].teams.splice(teamIdx, 1);
        setSports(updatedSports);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6">Coach Manage Teams</h1>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setShowSportModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Request New Sport
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
                            Request New Team
                        </button>
                    </div>

                    {/* SPORTS LIST */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sports.map((sport, sIdx) => (
                            <div key={sport.id}>
                                {/* SPORT CARD */}
                                <div
                                    onClick={() =>
                                        setSelectedSportIndex(
                                            selectedSportIndex === sIdx ? null : sIdx
                                        )
                                    }
                                    className={`p-4 rounded shadow cursor-pointer transition ${selectedSportIndex === sIdx
                                            ? "border-2 border-blue-600 bg-blue-50"
                                            : "border bg-white"
                                        }`}
                                >
                                    <div
                                        className="h-32 bg-cover bg-center rounded mb-2"
                                        style={{ backgroundImage: `url(${sport.img})` }}
                                    />
                                    <h3 className="font-semibold text-center">{sport.name}</h3>
                                </div>

                                {/* SHOW APPROVED TEAMS ONLY */}
                                {selectedSportIndex === sIdx &&
                                    sport.teams?.length > 0 && (
                                        <div className="mt-2">
                                            {sport.teams.map((team, tIdx) => (
                                                <div
                                                    key={tIdx}
                                                    className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
                                                >
                                                    <span>{team.name}</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="text-blue-600 text-sm"
                                                            onClick={() => {
                                                                setTeamForm({ ...team });
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
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* SPORT REQUEST MODAL */}
            {showSportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-xl font-semibold mb-4">Request New Sport</h3>
                        <input
                            className="w-full p-2 mb-3 border rounded"
                            placeholder="Sport Name"
                            value={sportForm.name}
                            onChange={(e) =>
                                setSportForm({ ...sportForm, name: e.target.value })
                            }
                        />
                        <textarea
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Description (admin only)"
                            value={sportForm.description}
                            onChange={(e) =>
                                setSportForm({ ...sportForm, description: e.target.value })
                            }
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowSportModal(false)}
                                className="bg-gray-400 px-3 py-1 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendSportRequest}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TEAM REQUEST MODAL */}
            {showTeamModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-2xl">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingTeamIndex !== null ? "Edit Team" : "Request New Team"}
                        </h3>
                        <p className="text-sm mb-2 text-gray-600">
                            Selected Sport:{" "}
                            <strong>
                                {selectedSportIndex !== null
                                    ? sports[selectedSportIndex].name
                                    : ""}
                            </strong>
                        </p>
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
                                className="bg-gray-400 px-3 py-1 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendTeamRequest}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                                {editingTeamIndex !== null ? "Save Changes" : "Send Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* REQUEST SENT DIALOG */}
            {showRequestSent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-80 text-center">
                        <h3 className="text-xl font-semibold mb-4">Request Sent!</h3>
                        <p>Your request has been sent to the admin for approval.</p>
                        <button
                            onClick={() => setShowRequestSent(false)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default CoachManageTeams;
