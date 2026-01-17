import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear login/session state here if you have one
        // localStorage.removeItem("user"); // example
        navigate("/home"); // Redirect to GuestDashboard
    };
    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white dark:bg-background-dark">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">UniSports Hub</h1>
                    </Link>
                </div>

                {/* Links */}
                <nav className="hidden items-center gap-6 md:flex">
                    {["Coach Dashboard", "Manage Team", "Schedule Session"].map((link) => (
                        <Link
                            key={link}
                            to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-sm font-medium text-stone-700 hover:text-primary dark:text-stone-300 dark:hover:text-primary"
                        >
                            {link}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
