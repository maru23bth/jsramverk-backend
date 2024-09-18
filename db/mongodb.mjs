
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import 'dotenv/config'

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@jsramverk.tx1lg.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`;
const dbName = process.env.DB_NAME || 'SSREditor';
const collectionName = process.env.DB_COLLECTION || 'Documents';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

/**
 * Create a new MongoClient
 * @returns {MongoClient}
 */
const client = new MongoClient(uri, {
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
 * Get array documents from the database
 * @param {{}} query filter
 * @param {boolean} closeClient close the connection after fetching documents
 * @returns {Array} of documents
 */
export async function getDocuments(query = {}) {
    try {
        const collection = client.db(dbName).collection(collectionName)

        // Get all documents, convert _id to string and add created, filter out null values
        const documents = (await collection.find(query).toArray()).map(fullDocument).filter(Boolean);

        return documents;
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Get a document from the database by id
 * @param {string} id
 * @param {boolean} closeClient close the connection after fetching document
 * @returns {object|null} Document object or null
 */
export async function getDocument(id) {
    try {
        const documents = await getDocuments({ _id: new ObjectId(id) });
        return documents[0] || null;
    } catch {
        return null;
    }
}

/**
 * Returns a safe document object to insert into the database
 * @param {{title?: string, content?: string}} document 
 * @returns {{title?: string, content?: string}}
 */
function safeDocument(document) {
    const doc = {};
    if (document.title)
        doc.title = String(document.title);
    if (document.content)
        doc.content = String(document.content);
    return doc;
}

/**
 * Returns a full document object with created_at and id
 * @param {{_id: ObjectId, title: string, content: string}} document
 * @returns {{created_at: Date, id: string, title: string, content: string}|null}
 */
function fullDocument(document) {
    try {
        const doc = safeDocument(document);
        doc.created_at = document._id.getTimestamp();
        doc.id = document._id.toString();
        return doc;
    } catch {
        return null;
    }
}

/**
 * Save a document to the database
 * @param {} document
 * @returns {string|null} Document id or null
 */
export async function createDocument(document) {

    try {
        const collection = client.db(dbName).collection(collectionName)
        const result = await collection.insertOne(safeDocument(document));
        return result.insertedId?.toString() || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Update the document with id
 * @param {string} id
 * @param {object} document
 * @returns {number|null} number of matched documents or null
 */
export async function updateDocument(id, document) {

    try {
        const collection = client.db(dbName).collection(collectionName)
        const objectId = new ObjectId(id);
        // update
        const result = await collection.updateOne({ _id: objectId }, { $set: safeDocument(document) });

        return result.matchedCount;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Delete a document from the database
 * @param {string} id 
 * @returns {number} number of deleted documents
 */
export async function deleteDocument(id) {
    try {
        const collection = client.db(dbName).collection(collectionName)
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount || 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}
