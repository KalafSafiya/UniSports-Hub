import React, { useState, useEffect } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api";

function AdminCoachRequests() {
    const [requests, setRequests] = useState([]);
    const [approvingId, setApprovingId] = useState(null); 
    const [imageUrl, setImageUrl] = useState(""); 

    // Fetch pending requests from the backend database
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get("/sports/pending");
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };
        fetchRequests();
    }, []);

    // Handles the final approval with the image URL
    const submitApproval = async (sport_id) => {
        if (!imageUrl) return alert("Please provide an image URL.");
        try {
            await api.patch(`/sports/${sport_id}/status`, { 
                action: 'approve', 
                image: imageUrl 
            });
            setRequests(requests.filter((r) => r.sport_id !== sport_id));
            setApprovingId(null);
            setImageUrl("");
        } catch (error) {
            alert("Approval failed.");
        }
    };

    const handleReject = async (sport_id) => {
        try {
            await api.patch(`/sports/${sport_id}/status`, { action: 'reject' });
            setRequests(requests.filter((r) => r.sport_id !== sport_id));
        } catch (error) {
            alert("Rejection failed.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">Coach Schedule Requests</h1>
                    <p className="text-gray-600 mb-8">Review and manage new sport requests submitted by coaches.</p>
                    
                    <div className="space-y-4">
                        {requests.length === 0 ? (
                            <p className="text-gray-500">No pending requests.</p>
                        ) : (
                            requests.map((req) => (
                                <div key={req.sport_id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900">New Sport: {req.sport_name}</h3>
                                            <p className="text-gray-600">Coach: {req.coach?.name || 'Loading...'}</p>
                                            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-100 italic text-gray-700">
                                                "{req.description}"
                                            </div>
                                        </div>

                                        {/* Action Section with increased button widths */}
                                        <div className="flex flex-col gap-3 min-w-[180px]">
                                            {approvingId === req.sport_id ? (
                                                <div className="flex flex-col gap-2">
                                                    <input 
                                                        type="text"
                                                        placeholder="Paste Image URL"
                                                        className="border p-2 rounded text-sm w-full focus:ring-2 focus:ring-green-500 outline-none"
                                                        value={imageUrl}
                                                        onChange={(e) => setImageUrl(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => submitApproval(req.sport_id)} 
                                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded font-bold hover:bg-green-700 transition-colors"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button 
                                                            onClick={() => {setApprovingId(null); setImageUrl("");}} 
                                                            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded font-bold hover:bg-gray-300 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => setApprovingId(req.sport_id)} 
                                                        className="w-full min-w-[160px] bg-green-600 text-white py-2 px-6 rounded font-bold hover:bg-green-700 shadow-sm transition-all"
                                                    >
                                                        Approve Request
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReject(req.sport_id)} 
                                                        className="w-full min-w-[160px] bg-red-600 text-white py-2 px-6 rounded font-bold hover:bg-red-700 shadow-sm transition-all"
                                                    >
                                                        Reject Request
                                                    </button>
                                                </>
                                            )}
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
