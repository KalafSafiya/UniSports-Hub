import React, { useState, useEffect } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";

// Mock data (replace with API calls)
const mockRequests = [
    {
        id: 1,
        name: "John Doe",
        email: "john@vau.ac.lk",
        role: "Student",
        universityId: "2021/ICT/001",
        subject: "Venue Booking Issue",
        message: "I can't book the basketball court for next week.",
        attachment: null,
        status: "Pending",
    },
    {
        id: 2,
        name: "Priya Silva",
        email: "priya@vau.ac.lk",
        role: "Coach",
        subject: "New Schedule Request",
        message: "Please add training schedule for volleyball.",
        attachment: "uploads/schedule_request.pdf",
        status: "Pending",
    },
];

function AdminContactRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Replace with API call
        setRequests(mockRequests);
    }, []);

    const handleMarkReplied = (id) => {
        const updated = requests.map((req) =>
            req.id === id ? { ...req, status: "Replied" } : req
        );
        setRequests(updated);
        // Here you can also make an API call to update status in DB
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Contact Requests
                    </h1>

                    {requests.length === 0 ? (
                        <p className="text-gray-500">No contact requests found.</p>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <div
                                    key={req.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                {req.subject}{" "}
                                                <span
                                                    className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${req.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-green-100 text-green-800"
                                                        }`}
                                                >
                                                    {req.status}
                                                </span>
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                From: {req.name} ({req.role})
                                                {req.universityId && `, ID: ${req.universityId}`}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Email: {req.email}
                                            </p>
                                            <p className="mt-2 text-gray-700 dark:text-gray-200">
                                                {req.message}
                                            </p>
                                            {req.attachment && (
                                                <p className="mt-2">
                                                    Attachment:{" "}
                                                    <a
                                                        href={`/${req.attachment}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        View File
                                                    </a>
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {req.status === "Pending" && (
                                                <button
                                                    onClick={() => handleMarkReplied(req.id)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Mark as Replied
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AdminContactRequests;
