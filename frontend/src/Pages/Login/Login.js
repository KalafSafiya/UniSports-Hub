import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../Services/authService";

function Login() {
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Go back to previous page
    const handleClose = () => {
        navigate(-1); // go back to the previous page
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await login({
                username,
                password
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            if (data.user.role === "Admin") {
                navigate("/admin-dashboard");
            }
            else if (data.user.role === "Coach") {
                navigate("/coach-dashboard");
            }
        }
        catch (error) {
            setError(
                error.response?.data?.message || "Login Failed. Please try again."
            );
        }
    };

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                {/* Close Button */}

                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 font-bold text-xl hover:text-red-500"
                >
                    ×
                </button>

                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                    Login
                </h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Coach">Coach</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-primary px-4 py-2 text-white font-bold hover:bg-primary-dark transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;