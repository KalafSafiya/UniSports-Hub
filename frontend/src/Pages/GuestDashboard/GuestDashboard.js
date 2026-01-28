import React from "react";
import Navbar from "../../GuestComponents/NavBar";
import Hero from "../../GuestComponents/Hero";
import NewsSection from "../../GuestComponents/NewsSection";
import Announcements from "../../GuestComponents/Announcements";
import Footer from "../../GuestComponents/Footer";

function GuestDashboard() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow pt-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Hero />
                    <NewsSection />
                    <Announcements />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default GuestDashboard;