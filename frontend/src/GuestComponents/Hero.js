import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate(); // <-- initialize navigate

    return (
        <section className="relative min-h-[480px] w-full overflow-hidden rounded-xl">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqYniO_qU52QB-57OdaZq5JV5hQqploLRR_Ze_kpyNWsDFootQ6tEWukh0ge38vx-XV8Q3WTLPo_iqGTrfexqBA9gSfZ20AKFOYPcqPVytq31IS4xL4LqSfT75iCyf1bPTj3yRSAAu-hfay2A3zislBfiy6nrB-ujdHjZg3-PZltzl_OwK2pm_a1104tH6WqDD6f-RMSG_MSEdHmiBkHXTUKgqXYwDi18B9XFwikVHzkT_LQ6fd20iI31DI-5Bi5oXbY_X82xmY90")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center text-white">
                <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                    Stay Updated with University Sports
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-white/90">
                    Get the latest news, schedules, and announcements from the UniSports Hub.
                </p>
                <button
                    className="mt-8 rounded-lg bg-primary px-6 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
                    onClick={() => navigate("/sports-and-teams")} // <-- works now
                >
                    Explore Sports
                </button>
            </div>
        </section>
    );
}

export default Hero;