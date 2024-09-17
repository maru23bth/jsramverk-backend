
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import 'dotenv/config'

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@jsramverk.tx1lg.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`;

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
        const collection = client.db("SSREditor").collection("Documents")
        const documents = await collection.find(query).toArray()
        documents.forEach(doc => {
            doc.created_at = doc._id.getTimestamp();
            doc.id = doc._id.toString();
            delete doc._id;
        });
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
 * Returns a safe document object
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
 * Save a document to the database
 * @param {} document
 * @returns {string|null} Document id or null
 */
export async function createDocument(document) {

    try {
        const collection = client.db("SSREditor").collection("Documents")
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
        const collection = client.db("SSREditor").collection("Documents")
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
        const collection = client.db("SSREditor").collection("Documents")
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount || 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}
