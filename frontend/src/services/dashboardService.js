import api from "./api";

export async function getDashboardMetrics() {
    const response = await api.get("/metrics/dashboard");
    return response.data;
}