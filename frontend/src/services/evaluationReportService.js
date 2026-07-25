import api from "./api";

export async function getEvaluation(id) {
    const { data } = await api.get(`/evaluations/${id}`);
    return data;
}

export async function getMetrics(id) {
    const { data } = await api.get(`/evaluations/${id}/metrics`);
    return data;
}

export async function getReport(id) {
    const { data } = await api.get(`/evaluations/${id}/report`);
    return data;
}

export async function getInsights(id) {
    const { data } = await api.get(`/evaluations/${id}/insights`);
    return data;
}

export async function exportPdf(id) {
    const response = await api.get(
        `/evaluations/${id}/export/pdf`,
        {
            responseType: "blob",
        }
    );

    return response.data;
}

export async function exportCsv(id) {
    const response = await api.get(
        `/evaluations/${id}/export/csv`,
        {
            responseType: "blob",
        }
    );

    return response.data;
}