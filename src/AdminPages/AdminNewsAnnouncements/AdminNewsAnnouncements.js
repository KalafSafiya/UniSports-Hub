import React, { useState } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import { getNews, getNewsById, createNews, updateNews, deleteNews } from "../../Services/newsService";
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncementById } from "../../Services/announcementService";

function AdminNewsAnnouncements() {
    const [activeTab, setActiveTab] = useState("news"); // 'news' or 'announcements'
    const [formData, setFormData] = useState({ title: "", description: "", image: "", date: "", link: "" });
    const [newsList, setNewsList] = useState([]);
    const [announcementsList, setAnnouncementsList] = useState([]);

    useEffect(() => {
        fetchAllNews();
        fetchAllAnnouncements();
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });
    }

    const fetchAllAnnouncements = async () => {
        try {
            const data = await getAnnouncements();
            setAnnouncementsList(Array.isArray(data) ? data : []);
        }
        catch (error) {
            console.log("Error fetching announcements: ", error);
        }
    }

    const fetchAllNews = async () => {
        try {
            const data = await getNews();
            setNewsList(Array.isArray(data) ? data : []);
        }
        catch (error) {
            console.log("Error fetching news:", error);
        }
    }
    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddItem = () => {
        if (!formData.title || !formData.description) return alert("Please fill all required fields");

        const newItem = { ...formData, id: Date.now() };

        if (activeTab === "news") {
            setNewsList([...newsList, newItem]);
        } else {
            setAnnouncementsList([...announcementsList, newItem]);
        }

        setFormData({ title: "", description: "", image: "", date: "", link: "" });
    };

    const handleDelete = (id) => {
        if (activeTab === "news") {
            setNewsList(newsList.filter((item) => item.id !== id));
        } else {
            setAnnouncementsList(announcementsList.filter((item) => item.id !== id));
        }
    };

    const list = activeTab === "news" ? newsList : announcementsList;

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-6">Manage News & Announcements</h1>
                    <p className="text-gray-600 mb-6">Add, edit, or remove updates visible to all guests.</p>

                    {/* Tabs */}
                    <div className="flex space-x-4 mb-8">
                        <button
                            onClick={() => setActiveTab("news")}
                            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "news" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                        >
                            News
                        </button>
                        <button
                            onClick={() => setActiveTab("announcements")}
                            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "announcements" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                        >
                            Announcements
                        </button>
                    </div>

                    {/* Add Form */}
                    <div className="bg-white rounded-lg shadow p-6 mb-10">
                        <h2 className="text-xl font-semibold mb-4">Add {activeTab === "news" ? "News" : "Announcement"}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Title"
                                className="border rounded p-2"
                            />
                            <input
                                type="text"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                placeholder="Date (optional)"
                                className="border rounded p-2"
                            />
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="Image URL (optional)"
                                className="border rounded p-2"
                            />
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleInputChange}
                                placeholder="Link (optional)"
                                className="border rounded p-2"
                            />
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="border rounded p-2 w-full mt-4 h-24"
                        />
                        <button
                            onClick={handleAddItem}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add {activeTab === "news" ? "News" : "Announcement"}
                        </button>
                    </div>

                    {/* List Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">{activeTab === "news" ? "News List" : "Announcements List"}</h2>
                        {list.length === 0 ? (
                            <p className="text-gray-500">No {activeTab === "news" ? "news" : "announcements"} added yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {list.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-gray-50 border p-4 rounded-lg flex justify-between items-start"
                                    >
                                        <div>
                                            <h3 className="font-bold text-lg">{item.title}</h3>
                                            <p className="text-gray-700">{item.description}</p>
                                            {item.date && <p className="text-sm text-gray-500 mt-1">{formatDate(item.date)}</p>}
                                            {item.link && (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 text-sm hover:underline"
                                                >
                                                    View Link
                                                </a>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:underline font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AdminNewsAnnouncements;
