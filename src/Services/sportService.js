import api from './api';

const API_URL = "http://localhost:5000/api/sports";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Fetch all sports
export const getAllSports = async () => {
    const response = await api.get(API_URL, authHeader());
    return response.data;
}

// Fetch a single sport by id
export const getSportById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`, authHeader());
    return response.data;
}

// Create a new sport
export const createSport = async (data) => {
    const response = await api.post(API_URL, data, authHeader());
    return response.data;
}

// Update a sport
export const updateSport = async (id, updatedData) => {
    const response = await api.put(`${API_URL}/${id}`, updatedData, authHeader());
    return response.data;
}

// Delete a sport
export const deleteSport = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
}