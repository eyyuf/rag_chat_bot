import { useState, useEffect } from "react";
import documentService from "../../services/document.service";
import "../../styles/admin.css";

const DocumentList = ({ refresh }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            const data = await documentService.getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [refresh]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            await documentService.deleteDocument(id);
            setDocuments(documents.filter((doc) => doc._id !== id));
        } catch (error) {
            console.error("Failed to delete document:", error);
            alert("Delete failed");
        }
    };

    if (loading) {
        return <div className="document-list-loading">Loading documents...</div>;
    }

    return (
        <div className="document-list">
            <h3>Uploaded Documents</h3>
            {documents.length === 0 ? (
                <p className="document-list-empty">No documents uploaded yet.</p>
            ) : (
                <table className="document-table">
                    <thead>
                        <tr>
                            <th>Filename</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Chunks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc) => (
                            <tr key={doc._id}>
                                <td>{doc.filename}</td>
                                <td>{doc.fileType}</td>
                                <td>{doc.status}</td>
                                <td>{doc.vectorCount || 0}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(doc._id)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DocumentList;
