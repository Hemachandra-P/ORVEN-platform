import api from "./api";

const organizationService = {
    // Get all organizations
    getOrganizations: async () => {
        const response = await api.get("/organizations/");
        return response.data;
    },

    // Get organization by ID
    getOrganization: async (id) => {
        const response = await api.get(`/organizations/${id}`);
        return response.data;
    },

    // Create organization
    createOrganization: async (data) => {
        const response = await api.post("/organizations/", data);
        return response.data;
    },

    // Update organization
    updateOrganization: async (id, data) => {
        const response = await api.patch(`/organizations/${id}`, data);
        return response.data;
    },

    // Delete organization
    deleteOrganization: async (id) => {
        const response = await api.delete(`/organizations/${id}`);
        return response.data;
    },
};

export default organizationService;