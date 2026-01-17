import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Create a new user
export const createUser = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
}

// Fetch all users
export const getAllUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}

// Update user
export const updateUser = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
}

// Delete user
export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}