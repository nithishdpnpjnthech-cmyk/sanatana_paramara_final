import apiClient from './api';

const returnApi = {
    submitReturn(formData) {
        return apiClient.post('/returns', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getUserReturns(email) {
        return apiClient.get('/returns/user', { params: { email } });
    },

    getAllReturns() {
        return apiClient.get('/returns/admin');
    },

    updateReturnStatus(id, status) {
        return apiClient.put(`/returns/admin/${id}/status`, { status });
    },
};

export default returnApi;
