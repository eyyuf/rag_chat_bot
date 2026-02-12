import { useState, useEffect } from 'react';
import { Upload, File, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import api from '../api/api';

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/documents');
            setDocuments(res.data);
        } catch (err) {
            console.error('Failed to fetch documents', err);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setMessage('');

        try {
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage('Document uploaded successfully and is being processed!');
            setFile(null);
            fetchDocuments();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        try {
            await api.delete(`/documents/${id}`);
            fetchDocuments();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    return (
        <div className="admin-dashboard animate-fade-in">
            <div className="container">
                <header className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage your knowledge base and vector embeddings.</p>
                </header>

                <div className="dashboard-grid">
                    {/* Upload Section */}
                    <section className="upload-card glass-morphism">
                        <h2>Upload Document</h2>
                        <form onSubmit={handleUpload}>
                            <div className="dropzone">
                                <input
                                    type="file"
                                    accept=".pdf,.txt"
                                    onChange={handleFileChange}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="dropzone-label">
                                    <Upload size={32} />
                                    <span>{file ? file.name : 'Select PDF or Text file'}</span>
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={!file || uploading}
                            >
                                {uploading ? 'Processing...' : 'Upload & Process'}
                            </button>
                        </form>
                        {message && <p className="status-msg">{message}</p>}
                    </section>

                    {/* Documents List */}
                    <section className="docs-list glass-morphism">
                        <h2>Your Documents</h2>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Vectors</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc._id}>
                                            <td className="doc-name">
                                                <File size={16} />
                                                <span>{doc.filename}</span>
                                            </td>
                                            <td>
                                                <StatusBadge status={doc.status} />
                                            </td>
                                            <td>{doc.vectorCount}</td>
                                            <td>
                                                <button onClick={() => handleDelete(doc._id)} className="delete-btn">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {documents.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="empty-state">No documents found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .admin-dashboard { padding: 4rem 0; }
                .dashboard-header { margin-bottom: 3rem; text-align: center; }
                .dashboard-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
                .dashboard-header p { color: var(--text-muted); }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 2rem;
                }

                .upload-card, .docs-list {
                    padding: 2rem;
                    border-radius: 1rem;
                }

                h2 { font-size: 1.25rem; margin-bottom: 1.5rem; }

                .dropzone {
                    border: 2px dashed var(--border);
                    border-radius: 0.5rem;
                    padding: 2rem;
                    text-align: center;
                    margin-bottom: 1.5rem;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .dropzone:hover { border-color: var(--primary); }
                .dropzone input { display: none; }
                .dropzone-label { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-muted); }

                .btn-full { width: 100%; justify-content: center; }

                table { width: 100%; border-collapse: collapse; }
                th, td { text-align: left; padding: 1rem; border-bottom: 1px solid var(--border); }
                th { color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; }
                
                .doc-name { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
                .delete-btn { color: var(--text-muted); background: none; }
                .delete-btn:hover { color: var(--error); }

                .badge {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 0.25rem 0.6rem;
                    border-radius: 1rem;
                    width: fit-content;
                }
                .badge.pending { background: rgba(234, 179, 8, 0.1); color: #eab308; }
                .badge.processed { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
                .badge.failed { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

                .status-msg { margin-top: 1rem; font-size: 0.9rem; text-align: center; }
                
                @media (max-width: 900px) {
                    .dashboard-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'processed': return <div className="badge processed"><CheckCircle size={12} /> Processed</div>;
        case 'failed': return <div className="badge failed"><XCircle size={12} /> Failed</div>;
        default: return <div className="badge pending"><Clock size={12} /> Pending</div>;
    }
};

export default AdminDashboard;
