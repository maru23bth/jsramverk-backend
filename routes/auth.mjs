import express from 'express';
import * as auth from '../db/auth.mjs';

const router = express.Router();
export default router;

// GET /auth - Return current user
router.get('/', auth.middlewareCheckToken , async (req, res) => {
    if (!res.locals.user) {
        res.status(401).json({error: 'Invalid token'});
        return;
    }
    res.json(res.locals.user);
});


// POST /auth/ - Login user
router.post('/', async (req, res) => {
    
    if (!req.body.username || !req.body.password) {
        res.status(400).json({error: 'Username and password are required'});
        return;
    }

    try {
        const user = await auth.authenticateUser(req.body.username, req.body.password);
        if (!user) {
            res.status(401).json({error: 'Invalid username or password'});
            return;
        }
        const token = auth.createToken(user);
        res.json({token});            
    } catch (error) {
        res.status(400).json({error: error.message});
        
    }
});

// PUT /documents/ - Creat a new user
router.put('/', async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).json({error: 'Username, email and password are required'});
        return;
    }

    try {
        const userId = await auth.createUser(req.body.username, req.body.email, req.body.password);
        res.json({userId});
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
});

// POST /auth/invite - Invite a user to join the application via email
router.post('/invite', auth.middlewareCheckToken, async (req, res) => {
    if (!req.body.email) {
        res.status(400).json({error: 'Email is required'});
        return;
    }

    try {
        await auth.sendEmail(
            req.body.email,
            'Invitation to join',
            `You have been invited to join the application.\n
            \n
            Please click the following link to sign up:\n
            https://www.student.bth.se/~maru23/editor/auth/signup
            `);
        res.json({message: 'Email sent'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});