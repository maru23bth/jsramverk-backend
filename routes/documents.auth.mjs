import express from 'express';
import * as db from '../db/mongodb.auth.mjs';
import * as auth from '../db/auth.mjs';

const router = express.Router();
export default router;

// GET /documents - List all documents
router.get('/', auth.middlewareCheckToken, async (req, res) => {
    res.json(await db.getUserDocuments(res.locals.user));
});

// GET /documents/:id - Get a specific document
router.get('/:id', auth.middlewareCheckToken, async (req, res) => {
    res.json(await db.getDocument(res.locals.user, req.params.id));
});

// POST /documents - Create a new document 
router.post('/', auth.middlewareCheckToken, async (req, res) => {
    console.log(req.body);
    const id = await db.createDocument(res.locals.user, req.body.title, req.body.content);
    if (!id) {
        res.status(500).json({error: 'Failed to create document'});
        return;
    }
    console.log('Created document with id: ', id);
    res.json(await db.getDocument(id));
});

// PUT /documents/:id - Get a specific document
router.put('/:id', auth.middlewareCheckToken, async (req, res) => {

    // Check if document exists
    if(!await db.getDocument(res.locals.user, req.params.id)) {
        res.status(404).json({error: 'Document not found'});
        return;
    }

    console.log(req.body);
    const result = await db.updateDocument(res.locals.user, req.params.id, req.body);
    if (!result) {
        res.status(500).json({error: 'Failed to update document'});
        return;
    }
    res.json(await db.getDocument(res.locals.user, req.params.id));
});

// DELETE /documents/:id - delete a specific document
router.delete('/:id', auth.middlewareCheckToken, async (req, res) => {
    const result = await db.deleteDocument(res.locals.user, req.params.id);
    if (!result) {
        res.status(404).json({error: 'Failed to delete document'});
        return;
    }
    res.json({message: 'Document deleted'});
});
