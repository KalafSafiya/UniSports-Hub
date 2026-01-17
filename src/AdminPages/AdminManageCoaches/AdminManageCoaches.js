import React, { useState, useEffect } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import { 
    getAllCoaches, 
    getCoachDetails, 
    toggleCoachStatus,
    updateCoach,
    deleteCoach
} from "../../Services/coachService";
import {
    createUser
} from '../../Services/userService';

function AdminManageCoaches() {
    
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCoaches();
    }, []);

    const loadCoaches = async () => {
        try {
            const coachList = await getAllCoaches();

            const detailedCoaches = await Promise.all(
                coachList.map(async (coach) => {
                    const details = await getCoachDetails(coach.user_id);

                    return {
                        id: coach.user_id,
                        name: coach.name,
                        email: coach.email,
                        status: coach.status,
                        sport: details.sports.map(s => s.sport_name).join(", "),
                        teams: details.teams.map(t => t.team_name)
                    };
                })
            );

            setCoaches(detailedCoaches);
        }
        catch (error) {
            console.error("Failed to load coaches");
            alert("Failed to load coaches");
        }
        finally {
            setLoading(false);
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoach, setEditingCoach] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        sport: '',
        mobileNumber: ''
    });

    const handleEdit = (coach) => {
        setEditingCoach(coach);
        setFormData({
            name: coach.name,
            email: coach.email,
            password: '', // Password not displayed for security
            sport: coach.sport,
            mobileNumber: coach.phone
        });
        setIsModalOpen(true);
    };

    const handleRemove = async (coachId) => {
        if (!window.confirm("Are you sure you want to remove this coach ?")) {
            return;
        }

        try {
            await deleteCoach(coachId);

            setCoaches(prevCoaches => prevCoaches.filter(c => c.id !== coachId));

            alert("Coach removed successfully");
        }
        catch (error) {
            console.error("Failed to delete coach: ", error);
            alert("Failed to remove coach. Please try again.");
        }
    }

    const handleToggleStatus = async (coachId) => {
        const coach = coaches.find(c => c.id === coachId);
        const newStatus = coach.status === 'Active' ? 'Inactive' : 'Active';

        try {
            await toggleCoachStatus(coachId, newStatus);

            setCoaches(coaches.map(c => 
                c.id === coachId ? { ...c, status: newStatus } : c
            ));
        }
        catch {
            alert('Failed to update status');
        }
    }

    const handleAddCoach = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoach(null);
        setFormData({ name: '', email: '', password: '', sport: '', mobileNumber: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try {
            if (editingCoach){
                const updated = await updateCoach(editingCoach.id, {
                    name: formData.name,
                    email: formData.email,
                    username: formData.username
                });

                setCoaches(coaches.map(c => 
                    c.id === editingCoach.id 
                    ? {...c, ...updated} 
                    : c
                ));
                
            }
            else {
                const newCoach = await createUser({
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: "Coach",
                    status: "Active"
                });
                
                setCoaches(prev => [
                    ...prev,
                    {
                        id: newCoach.user_id,
                        name: newCoach.name,
                        username: newCoach.username,
                        status: newCoach.status,
                        sport: newCoach.sport,
                        teams: []
                    }
                ])
            }
            
            loadCoaches();
            setIsModalOpen(false);
            setEditingCoach(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                sport: '',
                username: ''
            })
        }
        catch (error) {
            alert("Failed to update coach");
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Manage Coaches
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        View, edit, and manage registered coaches in the system.
                    </p>

                    {/* Add Coach Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleAddCoach}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Add Coach
                        </button>
                    </div>

                    {/* Coaches List */}
                    <section>
    <h2 className="text-2xl font-semibold mb-4">Registered Coaches</h2>

    {loading ? (
        <p className="text-gray-500">Loading coaches...</p>
    ) : coaches.length === 0 ? (
        <p className="text-gray-500">No coaches registered.</p>
    ) : (
        <div className="space-y-4">
            {coaches.map((coach) => (
                <div key={coach.id} className="bg-white rounded-lg shadow p-5 border">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {coach.name}
                            </h3>
                            <p className="text-gray-600">Sport: {coach.sport}</p>
                            <p className="text-gray-600">Email: {coach.email}</p>
                            <p
                                className={`text-sm font-medium ${
                                    coach.status === "Active"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                Status: {coach.status}
                            </p>

                            {coach.teams.length > 0 && (
                                <ul className="mt-3 border-t pt-2 text-sm text-gray-700">
                                    <li>Teams: {coach.teams.join(", ")}</li>
                                </ul>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(coach)}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleToggleStatus(coach.id)}
                                className={`px-3 py-1 text-white rounded ${
                                    coach.status === "Active"
                                        ? "bg-yellow-600"
                                        : "bg-green-600"
                                }`}
                            >
                                {coach.status === "Active" ? "Deactivate" : "Activate"}
                            </button>
                            <button
                                onClick={() => handleRemove(coach.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )}
</section>

                </div>
            </main>

            {/* Modal for Adding/Editing Coach */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{editingCoach ? 'Edit Coach' : 'Add New Coach'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            {!editingCoach && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Sport</label>
                                <input
                                    type="text"
                                    name="sport"
                                    value={formData.sport}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingCoach ? 'Update Coach' : 'Add Coach'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default AdminManageCoaches;