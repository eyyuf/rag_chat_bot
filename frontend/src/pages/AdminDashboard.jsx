import { useState } from "react";
import UploadForm from "../components/admin/UploadForm";
import DocumentList from "../components/admin/DocumentList";
import "../styles/admin.css";

const AdminDashboard = () => {
    const [refresh, setRefresh] = useState(0);

    const handleUploadSuccess = () => {
        setRefresh((prev) => prev + 1);
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard</h1>
            <UploadForm onUploadSuccess={handleUploadSuccess} />
            <DocumentList refresh={refresh} />
        </div>
    );
};

export default AdminDashboard;
