import express from 'express';
import * as db from '../db/mongodb.mjs';

const router = express.Router();
export default router;

// GET /documents - List all documents
router.get('/', async (req, res) => {
    res.json(await db.getDocuments());
});

// GET /documents/:id - Get a specific document
router.get('/:id', async (req, res) => {
    res.json(await db.getDocument(req.params.id));
});

// POST /documents - Create a new document 
router.post('/', async (req, res) => {
    console.log(req.body);
    const id = await db.createDocument(req.body);
    if (!id) {
        res.status(500).json({error: 'Failed to create document'});
        return;
    }
    console.log('Created document with id: ', id);
    res.json(await db.getDocument(id));
});

// PUT /documents/:id - Get a specific document
router.put('/:id', async (req, res) => {

    // Check if document exists
    if(!await db.getDocument(req.params.id)) {
        res.status(404).json({error: 'Document not found'});
        return;
    }

    console.log(req.body);
    const result = await db.updateDocument(req.params.id, req.body);
    if (!result) {
        res.status(500).json({error: 'Failed to update document'});
        return;
    }
    res.json(await db.getDocument(req.params.id));
});

// DELETE /documents/:id - delete a specific document
router.delete('/:id', async (req, res) => {
    const result = await db.deleteDocument(req.params.id);
    if (!result) {
        res.status(404).json({error: 'Failed to delete document'});
        return;
    }
    res.json({message: 'Document deleted'});
});
