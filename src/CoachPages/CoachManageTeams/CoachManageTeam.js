import React, { useState, useEffect } from "react";
import Navbar from "../../CoachComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api";

function CoachManageTeams() {
    const [sports, setSports] = useState([]);
    const [selectedSportIndex, setSelectedSportIndex] = useState(null);

    const [showSportModal, setShowSportModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [confirmMessage, setConfirmMessage] = useState("");

    const [sportForm, setSportForm] = useState({ name: "", description: "" });
    const [teamForm, setTeamForm] = useState({ id: null, name: "", members: [] });

    const [teamToDelete, setTeamToDelete] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get("/sports/my-approved");
            setSports(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    /* ---------- SPORT REQUEST ---------- */
    const handleSendSportRequest = async () => {
        if (!sportForm.name) return;

        try {
            await api.post("/sports", {
                sport_name: sportForm.name,
                description: sportForm.description,
            });

            setShowSportModal(false);
            setSportForm({ name: "", description: "" });

            setConfirmMessage("Your sport request has been sent.");
            setShowConfirmBox(true);
        } catch (error) {
            console.error(error);
        }
    };

    /* ---------- TEAM ---------- */
    const handleSendTeamRequest = async () => {
        if (!teamForm.name || selectedSportIndex === null) return;

        try {
            if (isEditing) {
                await api.put(`/teams/${teamForm.id}`, {
                    team_name: teamForm.name,
                    members: teamForm.members,
                });

                setConfirmMessage("Team updated successfully.");
            } else {
                await api.post("/teams", {
                    team_name: teamForm.name,
                    sport_id: sports[selectedSportIndex].sport_id,
                    members: teamForm.members,
                });

                setConfirmMessage("Team request sent.");
            }

            setShowTeamModal(false);
            setIsEditing(false);
            setTeamForm({ id: null, name: "", members: [] });

            setShowConfirmBox(true);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditTeam = (team) => {
        setIsEditing(true);

        setTeamForm({
            id: team.team_id,
            name: team.team_name,
            members: team.TeamMembers || [],
        });

        setShowTeamModal(true);
    };

    const openDeleteModal = (team) => {
        setTeamToDelete(team);
        setShowDeleteModal(true);
    };

    const confirmRemoveTeam = async () => {
        if (!teamToDelete) return;

        try {
            await api.delete(`/teams/${teamToDelete.team_id}`);

            setShowDeleteModal(false);
            setTeamToDelete(null);

            setConfirmMessage("Team removed successfully.");
            setShowConfirmBox(true);

            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddMemberField = () => {
        setTeamForm({
            ...teamForm,
            members: [
                ...teamForm.members,
                {
                    member_name: "",
                    registration_number: "",
                    role: "Player",
                    faculty: "Faculty of Applied Science",
                    year: "",
                },
            ],
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">

                    <h1 className="text-3xl font-bold mb-6">
                        Coach Manage Teams
                    </h1>

                    {/* Buttons */}
                    <div className="flex gap-3 mb-8">
                        <button
                            onClick={() => setShowSportModal(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                        >
                            Request New Sport
                        </button>

                        <button
                            disabled={selectedSportIndex === null}
                            onClick={() => {
                                setIsEditing(false);
                                setTeamForm({ id: null, name: "", members: [] });
                                setShowTeamModal(true);
                            }}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                        >
                            Request New Team
                        </button>
                    </div>

                    {/* Sports */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {sports.map((sport, sIdx) => (

                            <div key={sport.sport_id}>

                                <div
                                    onClick={() =>
                                        setSelectedSportIndex(
                                            selectedSportIndex === sIdx ? null : sIdx
                                        )
                                    }
                                    className={`p-4 rounded-xl shadow cursor-pointer border-2 ${selectedSportIndex === sIdx
                                        ? "border-blue-600 bg-blue-50"
                                        : "bg-white"
                                        }`}
                                >
                                    <div
                                        className="h-32 bg-cover bg-center rounded mb-2"
                                        style={{
                                            backgroundImage: `url(${sport.image})`,
                                        }}
                                    />

                                    <h3 className="font-bold text-center uppercase">
                                        {sport.sport_name}
                                    </h3>
                                </div>

                                {selectedSportIndex === sIdx && (

                                    <div className="mt-4 space-y-2">

                                        {sport.Teams?.filter(
                                            (t) => t.status === "Active"
                                        ).map((team) => (

                                            <div
                                                key={team.team_id}
                                                className="flex justify-between items-center bg-white p-3 rounded border"
                                            >
                                                <span>{team.team_name}</span>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() =>
                                                            handleEditTeam(team)
                                                        }
                                                        className="text-blue-600 font-bold"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(team)
                                                        }
                                                        className="text-red-600 font-bold"
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

            {/* TEAM MODAL */}
            {showTeamModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    style={{ overflow: "hidden" }}
                >
                    {/* Modal Box */}
                    <div
                        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col"
                        style={{ height: "85vh" }}
                    >
                        {/* Header */}
                        <div className="p-5 border-b" style={{ flexShrink: 0 }}>
                            <h3 className="text-2xl font-bold mb-3">
                                {isEditing ? "Edit Team" : "Request New Team"}
                            </h3>

                            <input
                                className="w-full border p-3 rounded"
                                placeholder="Team Name"
                                value={teamForm.name}
                                onChange={(e) =>
                                    setTeamForm({ ...teamForm, name: e.target.value })
                                }
                            />
                        </div>

                        {/* Scrollable Body */}
                        <div
                            className="px-5 py-4"
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                minHeight: 0,
                            }}
                        >
                            <h4 className="font-bold mb-4 text-gray-700">Members</h4>

                            {teamForm.members.map((m, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded border"
                                >
                                    <input
                                        className="border p-2 rounded"
                                        placeholder="Member Name"
                                        value={m.member_name}
                                        onChange={(e) => {
                                            const members = [...teamForm.members];
                                            members[idx].member_name = e.target.value;
                                            setTeamForm({ ...teamForm, members });
                                        }}
                                    />

                                    <input
                                        className="border p-2 rounded"
                                        placeholder="Reg No"
                                        value={m.registration_number}
                                        onChange={(e) => {
                                            const members = [...teamForm.members];
                                            members[idx].registration_number = e.target.value;
                                            setTeamForm({ ...teamForm, members });
                                        }}
                                    />

                                    <select
                                        className="border p-2 rounded"
                                        value={m.role}
                                        onChange={(e) => {
                                            const members = [...teamForm.members];
                                            members[idx].role = e.target.value;
                                            setTeamForm({ ...teamForm, members });
                                        }}
                                    >
                                        <option>Player</option>
                                        <option>Captain</option>
                                        <option>Vice Captain</option>
                                    </select>

                                    <select
                                        className="border p-2 rounded"
                                        value={m.faculty}
                                        onChange={(e) => {
                                            const members = [...teamForm.members];
                                            members[idx].faculty = e.target.value;
                                            setTeamForm({ ...teamForm, members });
                                        }}
                                    >
                                        <option>Faculty of Applied Science</option>
                                        <option>Faculty of Business Studies</option>
                                        <option>Faculty of Technology Studies</option>
                                    </select>

                                    <input
                                        type="number"
                                        min={1}
                                        max={4}
                                        className="border p-2 rounded"
                                        placeholder="Year"
                                        value={m.year}
                                        onChange={(e) => {
                                            const members = [...teamForm.members];
                                            members[idx].year = e.target.value;
                                            setTeamForm({ ...teamForm, members });
                                        }}
                                    />

                                    <button
                                        onClick={() => {
                                            const members = teamForm.members.filter(
                                                (_, i) => i !== idx
                                            );
                                            setTeamForm({ ...teamForm, members });
                                        }}
                                        className="text-red-600 font-bold text-left"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={handleAddMemberField}
                                className="bg-green-100 text-green-700 px-4 py-2 rounded font-bold w-full"
                            >
                                + Add Member
                            </button>
                        </div>

                        {/* Footer */}
                        <div
                            className="p-5 border-t flex justify-end gap-3"
                            style={{ flexShrink: 0 }}
                        >
                            <button
                                onClick={() => {
                                    setShowTeamModal(false);
                                    setIsEditing(false);
                                }}
                                className="px-4 py-2 text-gray-500"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSendTeamRequest}
                                className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold"
                            >
                                {isEditing ? "Save Changes" : "Send Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* CONFIRM BOX */}
            {showConfirmBox && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-xl text-center">

                        <h3 className="text-xl font-bold mb-2">
                            Success
                        </h3>

                        <p className="mb-4">{confirmMessage}</p>

                        <button
                            onClick={() => setShowConfirmBox(false)}
                            className="bg-black text-white px-6 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default CoachManageTeams;
