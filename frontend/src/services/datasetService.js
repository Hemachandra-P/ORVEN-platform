import api from "./api";

export const getDatasets = async () => {
    const { data } = await api.get("/datasets/");
    return data;
};

export const createDataset = async (dataset) => {
    const { data } = await api.post("/datasets/", dataset);
    return data;
};

export const updateDataset = async (id, dataset) => {
    const { data } = await api.patch(`/datasets/${id}`, dataset);
    return data;
};

export const deleteDataset = async (id) => {
    await api.delete(`/datasets/${id}`);
};