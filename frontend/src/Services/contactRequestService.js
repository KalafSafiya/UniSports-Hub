import api from './api';

const API_URL = 'http://localhost:5000/api/contact';

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Create a request
export const createRequest = async (data) => {
    const res = await api.post(API_URL, data, authHeader);
    return res.data;
}

// Get all Requests
export const getAllContactRequests = async () => {
    const res = await api.get(API_URL, authHeader());
    return res.data;
}

// Update request status
export const updateContactRequestStatus = async (id, status) => {
    const res = await api.put(`${API_URL}/${id}/status`, { status }, authHeader());
    return res.data;
}

// Vies / Download attachment
export const getContactAttachmentUrl = (filename) => {
    return `http://localhost:5000/uploads/contact/${filename}`;
}