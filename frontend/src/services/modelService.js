import api from "./api";

export const getModels = async () => {
    const { data } = await api.get("/ai-models/");
    return data;
};

export const createModel = async (model) => {
    const { data } = await api.post("/ai-models/", model);
    return data;
};

export const updateModel = async (id, model) => {
    const { data } = await api.patch(`/ai-models/${id}`, model);
    return data;
};

export const deleteModel = async (id) => {
    await api.delete(`/ai-models/${id}`);
};