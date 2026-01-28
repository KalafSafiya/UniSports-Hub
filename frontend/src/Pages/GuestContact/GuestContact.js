import React, { useState } from "react";
import Navbar from "../../GuestComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import { useNavigate } from "react-router-dom";
import {
    createRequest
} from '../../Services/contactRequestService';

function GuestContact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Student",
        universityId: "",
        subject: "",
        message: "",
        attachment: null,
    });

    const [status, setStatus] = useState(""); // "success" | "error"

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "attachment") {
            setFormData({ ...formData, attachment: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('role', formData.role);
            data.append('subject', formData.subject);
            data.append('message', formData.message);

            if (formData.role === 'Student') {
                data.append('universityId', formData.universityId);
            }

            if (formData.attachment) {
                data.append('attachment', formData.attachment);
            }

            await createRequest(data);

            setStatus('success');
            setTimeout(() => setStatus(''), 5000);

            setFormData({
                name: '',
                email: '',
                role: 'Student',
                universityId: '',
                subject: '',
                message: '',
                attachment: null
            });
        }
        catch (error) {
            console.error('Contact request failed: ', error);
            setStatus('error');
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow pt-20 pb-10">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Contact UniSports
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Have a question or feedback? Reach out to us and we’ll get back to
                            you.
                        </p>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate("/schedules")}
                            className="rounded-lg bg-primary px-6 py-3 text-white font-bold hover:scale-105 transition"
                        >
                            Book a Venue
                        </button>
                        <button
                            onClick={() => navigate("/schedules")}
                            className="rounded-lg border border-primary px-6 py-3 text-primary font-bold hover:bg-primary hover:text-white transition"
                        >
                            View Schedules
                        </button>
                    </div>

                    {/* Contact Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-lg border border-gray-200 bg-background-light p-6 shadow-sm dark:border-gray-700 dark:bg-background-dark"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Coach">Coach</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>

                            {/* University ID shows only for students */}
                            {formData.role === "Student" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        University ID
                                    </label>
                                    <input
                                        type="text"
                                        name="universityId"
                                        value={formData.universityId}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            )}

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Attachment (optional)
                                </label>
                                <input
                                    type="file"
                                    name="attachment"
                                    onChange={handleChange}
                                    className="mt-1 w-full text-gray-700 dark:text-gray-200"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-white font-bold hover:scale-105 transition"
                        >
                            Submit
                        </button>

                        {status === "success" && (
                            <p className="mt-4 text-center text-green-600 dark:text-green-400">
                                Message sent successfully!
                            </p>
                        )}
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default GuestContact;