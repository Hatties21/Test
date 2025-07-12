import apiClient from './apiClient';

const userApi = {
    updateUser: (userData) =>
        apiClient.put('/auth/me', userData),
    deleteUser: () => apiClient.delete('/auth/me'),

};

export default userApi;