import React, { useState, useEffect } from "react";
import Navbar from "../../CoachComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api";

function CoachManageTeams() {
    const [sports, setSports] = useState([]);
    const [showSportModal, setShowSportModal] = useState(false);
    const [showConfirmBox, setShowConfirmBox] = useState(false); // Controls the confirmation box
    const [sportForm, setSportForm] = useState({ name: "", description: "" });

    useEffect(() => {
        fetchApprovedSports();
    }, []);

    const fetchApprovedSports = async () => {
        try {
            const res = await api.get("/sports/approved");
            setSports(res.data);
        } catch (error) { console.error(error); }
    };

    const handleSendRequest = async () => {
        if (!sportForm.name) return;
        try {
            await api.post("/sports", { 
                sport_name: sportForm.name, 
                description: sportForm.description 
            });
            setShowSportModal(false);
            setSportForm({ name: "", description: "" });
            setShowConfirmBox(true); // Show custom confirmation instead of alert
        } catch (error) {
            alert("Error sending request.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Approved Sports</h1>
                        <button onClick={() => setShowSportModal(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">Request New Sport</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sports.map((sport) => (
                            <div key={sport.sport_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition">
                                <div 
                                    className="h-48 bg-cover bg-center" 
                                    style={{ backgroundImage: `url(${sport.image})` }}
                                >
                                    {!sport.image && <div className="h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>}
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-bold text-lg text-gray-800 uppercase tracking-wider">{sport.sport_name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* REQUEST FORM MODAL */}
            {showSportModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">New Sport Request</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Sport Name</label>
                                <input className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Rugby" onChange={e => setSportForm({...sportForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Reason / Description</label>
                                <textarea rows="3" className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Explain why this sport is needed..." onChange={e => setSportForm({...sportForm, description: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setShowSportModal(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleSendRequest} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md">Send Request</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRMATION TEXT BOX (MODAL) */}
            {showConfirmBox && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
                    <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm border-t-8 border-green-500 animate-in fade-in slide-in-from-bottom-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                        <p className="text-gray-600 mb-6">Your sport request has been successfully delivered to the admin for review.</p>
                        <button onClick={() => setShowConfirmBox(false)} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">Great, thanks!</button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default CoachManageTeams;
