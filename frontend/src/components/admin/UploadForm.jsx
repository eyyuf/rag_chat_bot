import { useState } from "react";
import documentService from "../../services/document.service";
import "../../styles/admin.css";

const UploadForm = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const data = await documentService.uploadDocument(formData);

            if (data.warning) {
                setSuccess(data.message);
                setError(data.warning); // Show warning in error box for visibility
            } else {
                setSuccess("Document uploaded successfully!");
            }

            setFile(null);
            e.target.reset();
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-form">
            <h3>Upload Document</h3>
            {error && <div className="upload-error">{error}</div>}
            {success && <div className="upload-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="upload-input"
                />
                <button type="submit" disabled={loading} className="upload-button">
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
};

export default UploadForm;
