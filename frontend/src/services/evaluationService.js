import api from "./api";

export const getEvaluations = (params = {}) =>
    api.get("/evaluations/", { params });

export const getEvaluation = (id) =>
    api.get(`/evaluations/${id}`);

export const createEvaluation = (data) =>
    api.post("/evaluations/", data);

export const updateEvaluation = (id, data) =>
    api.patch(`/evaluations/${id}`, data);

export const deleteEvaluation = (id) =>
    api.delete(`/evaluations/${id}`);

export const runEvaluation = (id) =>
    api.post(`/evaluations/${id}/run`);