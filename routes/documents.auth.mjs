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
    const id = await db.createDocument(res.locals.user, req.body.title, req.body.content, req.body.type || 'text');
    if (!id) {
        res.status(500).json({error: 'Failed to create document'});
        return;
    }
    console.log('Created document with id: ', id);
    res.json(await db.getDocument(res.locals.user, id));
});

// PUT /documents/:id - Update a specific document
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

// DELETE /documents/:id - Delete a specific document
router.delete('/:id', auth.middlewareCheckToken, async (req, res) => {
    const result = await db.deleteDocument(res.locals.user, req.params.id);
    if (!result) {
        res.status(404).json({error: 'Failed to delete document'});
        return;
    }
    res.json({message: 'Document deleted'});
});


// Handle comments
// POST /documents/:id/comment - Add a comment to a document
router.post('/:id/comment', auth.middlewareCheckToken, async (req, res) => {

    console.log(req.body);
    const result = await db.addComment(res.locals.user, req.params.id, req.body.content, req.body.location);
console.log('result', result);    
    if (!result) {
        res.status(500).json({error: 'Failed to add comment'});
        return;
    }
console.log('getDocument', res.locals.user, req.params.id);    
    res.json(await db.getDocument(res.locals.user, req.params.id));
});

// PUT /documents/:id/comment/:commentId - Add a comment to a document
router.put('/:id/comment/:commentId', auth.middlewareCheckToken, async (req, res) => {

    console.log(req.body);
    const result = await db.updateComment(res.locals.user, req.params.id, req.params.commentId, req.body.content);
    if (!result) {
        res.status(500).json({error: 'Failed to update comment'});
        return;
    }
    res.json(await db.getDocument(res.locals.user, req.params.id));
});

// DELETE /documents/:id/comment/:commentId - Add a comment to a document
router.delete('/:id/comment/:commentId', auth.middlewareCheckToken, async (req, res) => {

    const result = await db.deleteComment(res.locals.user, req.params.id, req.params.commentId);
    if (!result) {
        res.status(500).json({error: 'Failed to delete comment'});
        return;
    }
    res.json(await db.getDocument(res.locals.user, req.params.id));
});

// POST /documents/:id/collaborator - Add collaborator
router.post('/:id/collaborator', auth.middlewareCheckToken, async (req, res) => {
    let result;
    if(req.body.userId) {
        result = await db.addCollaborator(res.locals.user, req.params.id, req.body.userId);
    } else if(req.body.email) {
        result = await db.addCollaboratorByEmail(res.locals.user, req.params.id, req.body.email);
    }

    if (!result) {
        res.status(500).json({error: 'Failed to add collaborator'});
        return;
    }
    res.json(await db.getDocument(res.locals.user, req.params.id));
});

// DELETE /documents/:id/collaborator - Del collaborator
router.delete('/:id/collaborator', auth.middlewareCheckToken, async (req, res) => {

    console.log(req.body);
    const result = await db.removeCollaborator(res.locals.user, req.params.id, req.body.userId);
    if (!result) {
        res.status(500).json({error: 'Failed to delete collaborator'});
        return;
    }
    res.json(await db.getDocument(res.locals.user, req.params.id));
});
