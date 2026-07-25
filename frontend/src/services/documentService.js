import api from "./api";

export const getDocuments = async () => {
    const { data } = await api.get("/documents");
    return data;
};

export const uploadDocument = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const { data } = await api.post(
        "/documents/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};

export const deleteDocument = async (id) => {
    await api.delete(`/documents/${id}`);
};