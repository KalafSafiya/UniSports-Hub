import React, { useState, useEffect } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api";

function AdminBookingRequests() {
    const [bookings, setBookings] = useState([]);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    
    // Modal visibility and message states
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: "success", message: "" });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get("/bookings/pending");
            setBookings(res.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const triggerModal = (type, message) => {
        setModalConfig({ type, message });
        setShowModal(true);
    };

    const handleApprove = async (booking) => {
    try {
        await api.put(`/bookings/${booking.booking_id}/status`, {
            status: "Approved",
            user_email: booking.email, // This MUST exist in the booking data from DB
            event_name: booking.event_name
        });
        
        // Remove from list and show your success modal
        fetchBookings();
        setBookings(bookings.filter(b => b.booking_id !== booking.booking_id));
        triggerModal("success", "Booking approved and email sent!");
    } catch (error) {
        triggerModal("error", "Failed to send approval notification.");
    }
};

    const handleRejectSubmit = async (booking) => {
        if (!rejectReason) {
            triggerModal("error", "Please provide a reason for rejection.");
            return;
        }
        try {
            const response = await api.put(`/bookings/${booking.booking_id}/status`, {
                status: "Rejected",
                reason: rejectReason,
                user_email: booking.email,
                event_name: booking.event_name
            });

            if (response.status === 200) {
                setBookings(bookings.filter(b => b.booking_id !== booking.booking_id));
                setRejectingId(null);
                setRejectReason("");
                triggerModal("success", "Booking has been rejected and the reason has been sent to the user.");
            }
        } catch (error) {
            console.error("Rejection Error:", error);
            triggerModal("error", "Failed to reject the booking. Please try again.");
        }
    };

    const formatTime = (timeString) => {
        const date = new Date(`1970-01-01T${timeString}`);

        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Guest Booking Requests</h1>

                    {bookings.length === 0 ? (
                        <p className="text-gray-500 text-center py-10 bg-white rounded-xl shadow">No pending booking requests.</p>
                    ) : (
                        <div className="space-y-6">
                            {bookings.map((b) => (
                                <div key={b.booking_id} className="bg-white rounded-lg shadow p-6 border">
                                    <div className="flex flex-col md:flex-row justify-between items-start">
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-blue-900 mb-2">{b.event_name}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                                                <p><strong>User:</strong> {b.user_name} ({b.role})</p>
                                                <p><strong>Email:</strong> {b.email}</p>
                                                
                                                {/* FIX: Use b.Venue.name to show the fetched venue name */}
                                                <p><strong>Venue:</strong> {b.Venue ? b.Venue.name : "Venue Not Found"}</p>
                                                
                                                <p><strong>Sport:</strong> {b.Sport ? b.Sport.sport_name : "N/A"}</p>
                                                <p><strong>Date:</strong> {b.date}</p>
                                                <p><strong>Time:</strong> {formatTime(b.start_time)} - {formatTime(b.end_time)}</p>
                                            </div>
                                            {b.additional_notes && <p className="mt-3 text-sm italic text-gray-500">Notes: {b.additional_notes}</p>}
                                        </div>

                                        {/* Updated Action Container */}
<div className="flex flex-col gap-3 mt-4 md:mt-0 min-w-[240px]"> 
    {rejectingId === b.booking_id ? (
        <div className="space-y-3 animate-in slide-in-from-right-2">
            <textarea 
                className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" 
                placeholder="Type rejection reason here..." 
                rows="3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-2">
                <button 
                    onClick={() => handleRejectSubmit(b)} 
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
                >
                    Send & Reject
                </button>
                <button 
                    onClick={() => {setRejectingId(null); setRejectReason("");}} 
                    className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    ) : (
        <div className="flex flex-col gap-3">
            <button 
                onClick={() => handleApprove(b)} 
                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-green-700 transition-all transform active:scale-95 shadow-md flex items-center justify-center"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Approve Request
            </button>
            <button 
                onClick={() => setRejectingId(b.booking_id)} 
                className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-red-700 transition-all transform active:scale-95 shadow-md flex items-center justify-center"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                Reject Request
            </button>
        </div>
    )}
</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* STATUS NOTIFICATION MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-2xl animate-in zoom-in duration-200">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${modalConfig.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                            {modalConfig.type === "success" ? (
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {modalConfig.type === "success" ? "Success!" : "Wait a moment..."}
                        </h2>
                        <p className="text-gray-600 mb-8">{modalConfig.message}</p>
                        <button 
                            onClick={() => setShowModal(false)}
                            className={`w-full text-white py-3 rounded-xl font-bold transition shadow-lg ${modalConfig.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
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

export default AdminBookingRequests;