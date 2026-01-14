import axios from 'axios';
import { data } from 'react-router-dom';

const API_URL = "http://localhost:5000/api/announcements";

// Fetch all announcements
export const getAnnouncements = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Fetch a single announcement by ID
export const getAnnouncementById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}

// Create a new announcement
export const createAnnouncements = async () => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

// Update an existing announcement
export const updateAnnouncement = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
}

// Delete an announcement
export const deleteAnnouncement = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}