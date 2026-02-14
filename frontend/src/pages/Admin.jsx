import React, { useState, useEffect } from 'react';
import { IoTrash, IoCloudUpload, IoDocumentText } from 'react-icons/io5';
import { adminAPI } from '../utils/api';
import '../styles/Admin.css';

const Admin = () => {
    const [file, setFile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const fetchDocuments = async () => {
        try {
            const { data } = await adminAPI.getDocuments();
            setDocuments(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setStatus('Processing document...');
        try {
            await adminAPI.uploadFile(formData);
            setStatus('Success! Document indexed.');
            setFile(null);
            fetchDocuments();
        } catch (error) {
            setStatus('Upload failed. Check console.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this document and all its embeddings?')) return;
        try {
            await adminAPI.deleteDocument(id);
            fetchDocuments();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-page container">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
            </div>

            <div className="upload-section">
                <h3>Index New Content</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Upload PDF or TXT files to add them to the AI's knowledge base.
                </p>
                <form className="upload-form" onSubmit={handleUpload}>
                    <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileChange}
                        id="file-upload"
                        hidden
                    />
                    <label htmlFor="file-upload" className="file-input">
                        {file ? file.name : 'Click to select PDF or TXT'}
                    </label>
                    <button type="submit" className="upload-btn" disabled={loading || !file}>
                        {loading ? 'Processing...' : 'Upload & Index'}
                    </button>
                </form>
                {status && <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: status.includes('Success') ? 'green' : 'red' }}>{status}</p>}
            </div>

            <div className="doc-list-container">
                <h3>Knowledge Base Documents</h3>
                <div className="doc-list">
                    {documents.length === 0 ? (
                        <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>No documents found.</p>
                    ) : (
                        documents.map((doc) => (
                            <div key={doc._id} className="doc-item">
                                <div className="doc-info">
                                    <h4><IoDocumentText /> {doc.filename}</h4>
                                    <p>Type: {doc.fileType} | Size: {(doc.fileSize / 1024).toFixed(1)} KB | Added: {new Date(doc.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button className="delete-btn" onClick={() => handleDelete(doc._id)}>
                                    <IoTrash />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
