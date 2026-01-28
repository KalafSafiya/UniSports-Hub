import React, { useState, useEffect } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api";

function AdminCoachRequests() {
    const [sportRequests, setSportRequests] = useState([]);
    const [teamRequests, setTeamRequests] = useState([]);
    const [approvingId, setApprovingId] = useState(null); 
    const [imageUrl, setImageUrl] = useState(""); 

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const sports = await api.get("/sports/pending");
            setSportRequests(sports.data);
            
            // Fetching teams with status 'Inactive'
            const teams = await api.get("/teams/pending");
            setTeamRequests(teams.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    /* ---------- SPORT APPROVAL LOGIC ---------- */
    const submitSportApproval = async (sport_id) => {
        if (!imageUrl) return alert("Please provide an image URL.");
        try {
            await api.patch(`/sports/${sport_id}/status`, { action: 'approve', image: imageUrl });
            setSportRequests(sportRequests.filter((r) => r.sport_id !== sport_id));
            setApprovingId(null);
            setImageUrl("");
        } catch (error) { alert("Sport approval failed."); }
    };

    /* ---------- TEAM APPROVAL LOGIC ---------- */
    const handleApproveTeam = async (team_id) => {
        try {
            // FIX: Sending the status update to the backend
            await api.put(`/teams/${team_id}`, { status: 'Active' });
            
            // Remove from the local pending list once approved
            setTeamRequests(teamRequests.filter(t => t.team_id !== team_id));
            alert("Team approved successfully!");
        } catch (error) { 
            console.error("Error details:", error.response?.data);
            alert("Error approving team"); 
        }
    };

    const handleRejectTeam = async (team_id) => {
    try {
        // [FIX]: Send DELETE request to /api/teams/:id
        const response = await api.delete(`/teams/${team_id}`);
        
        if (response.status === 200) {
            // Update local state to remove the rejected request card
            setTeamRequests(teamRequests.filter(t => t.team_id !== team_id));
            alert("Team request rejected and removed.");
        }
    } catch (error) { 
        console.error("Rejection Error:", error.response?.data);
        alert("Error rejecting team");
    }
};

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4">
                    
                    {/* SECTION 1: SPORT REQUESTS */}
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">New Sport Requests</h1>
                    <div className="space-y-4 mb-12">
                        {sportRequests.map((req) => (
                            <div key={req.sport_id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900">Sport: {req.sport_name}</h3>
                                        <p className="text-gray-600">Coach: {req.coach?.name}</p>
                                        <div className="mt-3 p-3 bg-blue-50 rounded italic">"{req.description}"</div>
                                    </div>
                                    <div className="flex flex-col gap-3 min-w-[180px]">
                                        {approvingId === req.sport_id ? (
                                            <div className="flex flex-col gap-2">
                                                <input type="text" placeholder="Image URL" className="border p-2 rounded text-sm" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                                                <button onClick={() => submitSportApproval(req.sport_id)} className="bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Confirm</button>
                                                <button onClick={() => setApprovingId(null)} className="bg-gray-200 py-2 rounded">Cancel</button>
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => setApprovingId(req.sport_id)} className="bg-green-600 text-white py-2 px-6 rounded font-bold hover:bg-green-700">Approve</button>
                                                <button onClick={() => api.patch(`/sports/${req.sport_id}/status`, {action: 'reject'}).then(() => setSportRequests(sportRequests.filter(r => r.sport_id !== req.sport_id)))} className="bg-red-600 text-white py-2 px-6 rounded font-bold hover:bg-red-700">Reject</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SECTION 2: TEAM REQUESTS */}
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">New Team Requests</h2>
                    <div className="space-y-6">
                        {teamRequests.length === 0 ? (
                            <p className="text-gray-500">No pending team requests.</p>
                        ) : (
                            teamRequests.map((team) => (
                                <div key={team.team_id} className="bg-white border rounded-xl shadow-sm p-6 overflow-hidden">
                                    <div className="flex justify-between items-start mb-4 border-b pb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-blue-700">{team.team_name}</h3>
                                            <p className="text-gray-600 font-semibold">Sport: {team.Sport?.sport_name}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => handleApproveTeam(team.team_id)} 
                                                className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md transition"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleRejectTeam(team.team_id)} 
                                                className="bg-red-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-red-700 shadow-md transition"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-bold text-gray-700 mb-3 underline">Requested Team Members:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {team.TeamMembers?.map((m) => (
                                                <div key={m.member_id} className="bg-white p-3 rounded border shadow-sm flex flex-col">
                                                    <span className="font-bold text-gray-800">{m.member_name}</span>
                                                    <span className="text-blue-600 text-sm font-medium">{m.role}</span>
                                                    <span className="text-gray-500 text-xs mt-1">Reg: {m.registration_number}</span>
                                                    <span className="text-gray-400 text-xs">{m.faculty} | Year {m.year}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AdminCoachRequests;
