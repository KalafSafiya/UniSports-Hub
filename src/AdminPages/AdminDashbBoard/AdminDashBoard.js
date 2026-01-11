import React, { Activity, useState } from "react";
import { FileText, Megaphone, Image, ClipboardList, Users, Calendar } from "lucide-react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";

const mockStats = {
    news: 5,
    announcements: 3,
    coverPhotos: 1,
    pendingBookings: 4,
    pendingTeams: 2,
};

function AdminDashboard() {
    const [stats] = useState(mockStats);

    const cards = [
        {
            title: "News and Announcements",
            value: stats.news,
            icon: <FileText className="w-10 h-10 text-blue-500" />,
            color: "bg-blue-50",
            button: "Manage",
            path: "/news-and-announcements",
        },

        {
            title: "Pending Sports and Teams",
            value: stats.announcements,
            icon: <Users className="w-10 h-10 text-yellow-500" />,
            color: "bg-yellow-50",
            button: "Manage",
            path: "/sports-requests",
        },

        {
            title: "Pending Bookings",
            value: stats.pendingBookings,
            icon: <ClipboardList className="w-10 h-10 text-green-500" />,
            color: "bg-green-50",
            button: "Review",
            path: "/booking-requests",
        },
        {
            title: "Pending Schedules",
            value: stats.pendingTeams,
            icon: <Calendar className="w-10 h-10 text-pink-500" />,
            color: "bg-pink-50",
            button: "Approve",
            path: "/schedule-requests",
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow pt-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                            A central hub for managing news, announcements, cover photos, bookings, and team approvals.
                        </p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cards.map((card) => (
                            <div
                                key={card.title}
                                className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${card.color} flex flex-col justify-between`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>{card.icon}</div>
                                    <p className="text-4xl font-extrabold text-gray-700">{card.value}</p>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Quick access to manage {card.title.toLowerCase()} details.
                                    </p>
                                    <button
                                        onClick={() => (window.location.href = card.path)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                    >
                                        {card.button}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AdminDashboard;


