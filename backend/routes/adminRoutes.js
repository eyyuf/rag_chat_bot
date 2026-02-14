const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');
const { processDocument, deleteDocument, getAllDocuments } = require('../services/documentService');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and TXT files are allowed'), false);
        }
    }
});

// All routes here protected and admin only
router.use(protect);
router.use(authorize('admin'));

// @desc    Upload document
// @route   POST /api/admin/upload
router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', data: null, error: 'No file uploaded' });
        }
        const data = await processDocument(req.file);
        res.status(201).json({
            status: 'success',
            data,
            error: null
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete document
// @route   DELETE /api/admin/documents/:id
router.delete('/documents/:id', async (req, res, next) => {
    try {
        await deleteDocument(req.params.id);
        res.status(200).json({
            status: 'success',
            data: { message: 'Document removed' },
            error: null
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get all documents
// @route   GET /api/admin/documents
router.get('/documents', async (req, res, next) => {
    try {
        const data = await getAllDocuments();
        res.status(200).json({
            status: 'success',
            data,
            error: null
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
