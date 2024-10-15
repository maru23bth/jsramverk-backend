/**
 * Functions to handle user authentication
 */

import { client } from './mongodb.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import 'dotenv/config'

const dbName = process.env.DB_NAME || 'SSREditor';
const collectionName = process.env.DB_USER_COLLECTION || 'Users';
const secret = process.env.JWT_SECRET || '';
const saltRounds = 10;
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

/**
 * Validate email address
 * @param {string} email 
 * @returns boolean
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Create user
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {string} user id
 * @throws {Error} On invalid email, missing username or password or if user already exists
 */
export async function createUser(username, email, password) {
    // Validate user input
    if (!isValidEmail(email)) {
        throw new Error('Invalid email address');
    }
    // Check if username or password is empty or if username is an email
    if (!username || !password || isValidEmail(username)) {
        throw new Error('Username and password are required');
    }
    // Check if user already exists
    const collection = client.db(dbName).collection(collectionName);
    const user = await collection.findOne({ $or: [{ username }, { email }] });
    if (user) {
        throw new Error('User already exists');
    }

    // Hash password
    const hash = bcrypt.hashSync(password, saltRounds)
    // Insert user into database
    const result = await collection.insertOne({ username, email, password: hash });
    if (!result.insertedId)
        throw new Error('Failed to create user');

    return result.insertedId.toString()
}

/**
 * Authenticate user
 * @param {string} username Username, email
 * @param {string} password Unencrypted password
 * @returns {object | false} user object or false if authentication fails
 */
export async function authenticateUser(username, password) {
    const collection = client.db(dbName).collection(collectionName);
    const user = await collection.findOne({ $or: [{ username }, { email: username }] });
    if (!user) {
        return false;
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return false;
    }

    user.id = user._id.toString();

    return user;
}

/**
 * Decode jwt token
 * @param {string} token jwt token
 * @returns {object | false} user object or false if authentication fails
 */
export function decodeToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return false;
    }
}

/**
 * Create jwt token
 * @param {object} user User object
 * @returns {string} jwt token
 */
export function createToken(user) {
    return jwt.sign({ id: user.id, username: user.username, email: user.email }, secret, { expiresIn: '24h' });
}

/**
 * Middleware to validate jwt token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void} Stores user object in res.locals.user
 */
export async function middlewareCheckToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({ error: 'Token is required' });
        return;
    }

    res.locals.user = decodeToken(token);
    if (!res.locals.user) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }

    next();
}

/**
 * Send email
 * @param {string} to Email address
 * @param {string} subject Subject of the email
 * @param {string} text Text of the email
 * @returns {Promise<void>}
 * @throws {Error} On invalid email address or other errors
 */
export async function sendEmail(to, subject, text) {

    const msg = {
        to,
        from: 'maru23@student.bth.se', // Change to your verified sender
        subject,
        text,
    }

    await sgMail.send(msg);
}