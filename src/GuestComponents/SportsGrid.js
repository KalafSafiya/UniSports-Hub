import React from "react";

const sports = [
    { name: "Basketball", img: "/images/basketball.jpg" },
    { name: "Football", img: "/images/football.png" },
    { name: "Table Tennis", img: "/images/tabletennis.jpg" },
    { name: "Cricket", img: "/images/cricket.jpg" },
    { name: "Volleyball", img: "/images/volleyball.jpg" },
    { name: "Chess", img: "/images/chess.jpg" },
    { name: "Badminton", img: "/images/badminton.jpg" },
    { name: "Carrom", desc: "Practice sessions", img: "/images/carrom.jpg" },
];

function SportsGrid() {
    return (
        <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Available Sports</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {sports.map((sport, i) => (
                    <div key={i} className="group flex flex-col gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-background-dark dark:border dark:border-gray-800">
                        <div className="aspect-square w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${sport.img})` }}></div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{sport.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{sport.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SportsGrid;
