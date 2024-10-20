
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import 'dotenv/config'

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@jsramverk.tx1lg.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`;
const dbName = process.env.DB_NAME || 'SSREditor';
const DB_DOCUMENTS_COLLECTION = process.env.DB_DOCUMENTS_COLLECTION || 'DocumentWithUser';
const DB_USERS_COLLECTION = process.env.DB_USERS_COLLECTION || 'Users';

/**
 * Types
 * @typedef {{id: string, type: string, title: string, content: string, collaborators: User[], comments: Comment[]}} Document
 * @typedef {{id: string, username: string, email: string}} User
 * @typedef {{id: string, author: User, content: string, location: string}} Comment
 */

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

/**
 * Create a new MongoClient
 * @returns {MongoClient}
 */
export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

/** connects client */
export async function connect() {
    await client.connect();
}

/** closes db connection */
export async function close() {
    await client.close();
}

/**
 * Format Document object
 * @param {Object} document
 * @returns {Document}
 */
function formatDocument(document) {
    return {
        id: document._id.toString(),
        title: document.title,
        content: document.content,
        collaborators: document.collaborators?.map(formatUser) || [],
        comments: document.comments?.map(formatComment) || [],
    }
}

/**
 * Format user object
 * @param {Object} user 
 * @returns {User}
 */
function formatUser(user) {
    return {
        id: user?.id || user?._id?.toString() || '',
        username: user?.username || '',
        email: user?.email || '',
    }
}

/**
 * Format comment object
 * @param {Object} comment 
 * @returns {Comment}
 */
function formatComment(comment) {
    return {
        id: comment.id,
        author: formatUser(comment.author),
        content: comment.content,
        location: comment.location,
    }
}


/**
 * Get array documents from the database
 * @param {Object} query filter
 * @returns {Array} of documents
 */
async function getDocuments(query = {}) {
    try {
        const collection = client.db(dbName).collection(DB_DOCUMENTS_COLLECTION)
        const pipeline = [
            {
              $match: query,
            },
            {
              $addFields: {
                collaborators: {
                  $map: {
                    input: "$collaborators",
                    in: { $toObjectId: "$$this" },
                  },
                },
              },
            },
            {
              $lookup: {
                from: DB_USERS_COLLECTION,
                localField: "collaborators",
                foreignField: "_id",
                as: "collaborators",
              },
            },
          ];

        // Get all documents, convert _id to string and add created, filter out null values
        const documents = (await collection.aggregate(pipeline).toArray()).map(formatDocument).filter(Boolean);

        return documents;
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Get a document from the database by id
 * @param {User} user
 * @param {string} id
 * @returns {Document|null} Document object or null
 */
export async function getDocument(user, id) {
    try {
        const documents = await getDocuments({ _id: ObjectId.createFromHexString(id), collaborators: user.id });
        return documents[0] || null;
    } catch {
        return null;
    }
}


/**
 * Get all documents from the database by user
 * @param {User} user
 * @returns {Document[]} Document object or null
 */
export async function getUserDocuments(user) {
    try {
        const documents = await getDocuments({ collaborators: user.id });
        return documents;
    } catch {
        return [];
    }
}


/**
 * Save a document to the database
 * @param {User} user User object
 * @param {string} title Title of the document
 * @param {string} content Content of the document
 * @param {string} type code or text
 * @returns {string|null} Document id or null
 */
export async function createDocument(user, title, content, type='text') {

    try {
        const collection = client.db(dbName).collection(DB_DOCUMENTS_COLLECTION);
        const doc = {
            type,
            title,
            content,
            collaborators: [user.id],
            comments: [],
        };

        if(!doc.title) {
            throw new Error('Title is required');
        }

        const result = await collection.insertOne(getUpdateDocument(doc));
        
        return result.insertedId?.toString() || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Input parameters for update and return update object
 * @param {object} document 
 * @returns {object} update object
 */
function getUpdateDocument(document) {
    const update = {};
    if (typeof document.type === 'string') {
        update.type = document.type === 'code' ? 'code' : 'text';
    }
    if (typeof document.title === 'string') {
        update.title = document.title;
    }
    if (typeof document.content === 'string') {
        update.content = document.content;
    }
    if (Array.isArray(document.collaborators)) {
        update.collaborators = document.collaborators;
    }
    if (Array.isArray(document.comments)) {
        update.comments = document.comments;
    }

    return update;
}

/**
 * Update the document with id
 * @param {User} user
 * @param {string} id
 * @param {object} document
 * @returns {number|null} number of matched documents or null
 */
export async function updateDocument(user, id, document) {
    try {
        const collection = client.db(dbName).collection(DB_DOCUMENTS_COLLECTION)
        // update
        const result = await collection.updateOne({ _id: ObjectId.createFromHexString(id), collaborators: user.id }, { $set: getUpdateDocument(document) });

        return result.matchedCount;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Delete a document from the database
 * @param {User} user
 * @param {string} id
 * @returns {number} number of deleted documents
 */
export async function deleteDocument(user, id) {
    try {
        const collection = client.db(dbName).collection(DB_DOCUMENTS_COLLECTION)
        const result = await collection.deleteOne({ _id: ObjectId.createFromHexString(id), collaborators: user.id });
        return result.deletedCount || 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

/**
 * Saves a new comment to the document
 * @param {User} user 
 * @param {string} id Document id
 * @param {string} content Comment content
 * @param {string} location  Comment location in the document
 * @returns {number|null} number of matched documents or null
 */
export async function addComment(user, id, content, location) {
    try {
        const comment = {
            id: new ObjectId().toString(),
            content,
            location,
            createdAt: new Date(),
            author: user,
        };
        const collection = client.db(dbName).collection(DB_DOCUMENTS_COLLECTION);
        const result = await collection.updateOne({ _id: ObjectId.createFromHexString(id), collaborators: user.id }, { $push: { comments: comment } });
        return result.matchedCount;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Delete a comment from the document
 * @param {User} user
 * @param {string} id Document id
 * @param {string} commentId Comment id
 * @returns {number} number of deleted documents
 */
export async function deleteComment(user, id, commentId) {
    try {
        const collection = client.db(dbName).collection(DB_DOCUMENTS_COLLECTION)
        const result = await collection.updateOne({ _id: ObjectId.createFromHexString(id), collaborators: user.id }, { $pull: { comments: { id: commentId } } });
        return result.matchedCount;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

/**
 * Update a comment in the document
 * @param {User} user
 * @param {string} id Document id
 * @param {string} commentId Comment id
 * @param {string} content Comment content
 * @returns {number|null} number of matched documents or null
 */
export async function updateComment(user, id, commentId, content) {
    try {
        const collection = client.db(dbName).collection(DB_DOCUMENTS_COLLECTION)
        const result = await collection.updateOne({ _id: ObjectId.createFromHexString(id), collaborators: user.id, 'comments.id': commentId }, { $set: { 'comments.$.content': content } });
        return result.matchedCount;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Add a user to the collaborators of the document
 * @param {User} user
 * @param {string} id Document id
 * @param {string} userId User id
 * @returns {number|null} number of matched documents or null
 */
export async function addCollaborator(user, id, userId) {
    try {
        const collection = client.db(dbName).collection(DB_DOCUMENTS_COLLECTION)
        const result = await collection.updateOne({ _id: ObjectId.createFromHexString(id), collaborators: user.id }, { $push: { collaborators: userId } });
        return result.matchedCount;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function addCollaboratorByEmail(user, id, email) {
    try {
        const collection = client.db(dbName).collection(DB_USERS_COLLECTION)
        const userToAdd = await collection
            .findOne({ email });
        if (!userToAdd) {
            throw new Error('User not found');
        }
        return addCollaborator(user, id, userToAdd._id.toString());
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Remove a user from the collaborators of the document
 * @param {User} user
 * @param {string} id Document id
 * @param {string} userId User id
 * @returns {number|null} number of matched documents or null
 */
export async function removeCollaborator(user, id, userId) {
    try {
        if (user.id === userId) {
            throw new Error('Cannot remove yourself from collaborators');
        }

        const collection = client.db(dbName).collection(DB_DOCUMENTS_COLLECTION);

        // Check if the document has this collaborator
        const document = await collection.findOne({
            _id: ObjectId.createFromHexString(id),
            collaborators: userId,  // Check if the collaborator exists
        });

        if (!document) {
            throw new Error('Collaborator not found');
        }

        // Proceed to remove the collaborator from the array
        const result = await collection.updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $pull: { collaborators: userId } }
        );

        return result.matchedCount;
    } catch (error) {
        console.error('Error removing collaborator:', error.message);
        return null;  // Return null on failure
    }
}

/**
 * Get userID by email
 * @param {string} email User email
 * @returns {String} is User id
 */
export async function getUserIdByEmail(email) {
    try {
        const collection = client.db(dbName).collection(DB_USERS_COLLECTION)
        const user = await collection
            .findOne({ email });
        if (!user) {
            throw new Error('User not found');
        } else {
            const id = user?._id.toString();
            return id;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}


// console.log(await getUserIdByEmail('user2@test.se'))