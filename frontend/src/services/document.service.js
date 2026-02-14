import api from "../app/axios";

const uploadDocument = async (formData) => {
    // Don't set Content-Type manually - axios sets it automatically for FormData
    // This preserves the Authorization header from the interceptor
    const response = await api.post("/admin/upload", formData);
    return response.data;
};

const getDocuments = async () => {
    const response = await api.get("/admin/documents");
    return response.data;
};

const deleteDocument = async (id) => {
    const response = await api.delete(`/admin/document/${id}`);
    return response.data;
};

const documentService = {
    uploadDocument,
    getDocuments,
    deleteDocument
};

export default documentService;
