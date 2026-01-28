import React, { useState, useEffect } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import {
    getPendingSports,
    updateSportStatus,
    updateSport,
    deleteSport,
    getApprovedSports,
    getAllSports
} from "../../Services/sportService";

function AdminManageSports() {

    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSports();
    }, []);

    const loadSports = async () => {
        try {
            const sportList = await getAllSports();

            const detailedSports = sportList.map((sport) => ({
                id: sport.sport_id,
                name: sport.sport_name,
                description: sport.description,
                coach: sport.coach ? sport.coach.name : 'Unknown',
                status: sport.status
            }));

            setSports(detailedSports);
        }
        catch (error) {
            console.error("Failed to load sports");
            alert("Failed to load sports");
        }
        finally {
            setLoading(false);
        }
    }

    const handleApprove = async (sportId) => {
        if (!window.confirm("Are you sure you want to approve this sport?")) {
            return;
        }

        try {
            await updateSportStatus(sportId, 'approve');

            setSports(sports.map(s =>
                s.id === sportId ? { ...s, status: 'Approved' } : s
            ));

            alert("Sport approved successfully");
        }
        catch (error) {
            console.error("Failed to approve sport: ", error);
            alert("Failed to approve sport. Please try again.");
        }
    }

    const handleReject = async (sportId) => {
        if (!window.confirm("Are you sure you want to reject this sport?")) {
            return;
        }

        try {
            await updateSportStatus(sportId, 'reject');

            setSports(sports.filter(s => s.id !== sportId));

            alert("Sport rejected successfully");
        }
        catch (error) {
            console.error("Failed to reject sport: ", error);
            alert("Failed to reject sport. Please try again.");
        }
    }

    const handleEdit = (sport) => {
        setEditingSport(sport);
        setFormData({
            name: sport.name,
            description: sport.description
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (sportId) => {
        if (!window.confirm("Are you sure you want to delete this sport?")) {
            return;
        }

        try {
            await deleteSport(sportId);

            setSports(sports.filter(s => s.id !== sportId));

            alert("Sport deleted successfully");
        }
        catch (error) {
            console.error("Failed to delete sport: ", error);
            alert("Failed to delete sport. Please try again.");
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSport, setEditingSport] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSport(null);
        setFormData({ name: '', description: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingSport){
                await updateSport(editingSport.id, {
                    sport_name: formData.name,
                    description: formData.description
                });

                setSports(sports.map(s =>
                    s.id === editingSport.id
                    ? {...s, name: formData.name, description: formData.description}
                    : s
                ));

                alert("Sport updated successfully");
            }

            setIsModalOpen(false);
            setEditingSport(null);
            setFormData({
                name: '',
                description: ''
            })
        }
        catch (error) {
            alert("Failed to update sport");
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Manage Sports
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        View, approve, reject, edit, and manage sports in the system.
                    </p>

                    {/* Sports List */}
                    <section>
    <h2 className="text-2xl font-semibold mb-4">Sports</h2>

    {loading ? (
        <p className="text-gray-500">Loading sports...</p>
    ) : sports.length === 0 ? (
        <p className="text-gray-500">No sports available.</p>
    ) : (
        <div className="space-y-4">
            {sports.map((sport) => (
                <div key={sport.id} className="bg-white rounded-lg shadow p-5 border">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {sport.name}
                            </h3>
                            <p className="text-gray-600">Description: {sport.description}</p>
                            <p className="text-gray-600">Coach: {sport.coach}</p>
                            <p
                                className={`text-sm font-medium ${
                                    sport.status === "Approved"
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                }`}
                            >
                                Status: {sport.status}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {sport.status === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(sport.id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(sport.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            {sport.status === 'Approved' && (
                                <>
                                    <button
                                        onClick={() => handleEdit(sport)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sport.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )}
</section>

                </div>
            </main>

            {/* Modal for Editing Sport */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Edit Sport</h2>
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
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                    rows="3"
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
                                    Update Sport
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

export default AdminManageSports;
