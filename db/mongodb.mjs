
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import 'dotenv/config'

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@jsramverk.tx1lg.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

/**
 * Create a new MongoClient
 * @returns MongoClient
 */
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connect() {
    await client.connect();
}

export async function close() {
    await client.close();
}

/**
 * Get array documents from the database
 * @param object query filter
 * @param boolean closeClient close the connection after fetching documents
 * @returns array of documents
 */
export async function getDocuments(query={}) {
  try {
    const collection = client.db("SSREditor").collection("Documents")
    const documents = await collection.find(query).toArray()
    documents.forEach(doc => {
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
 * @param string id
 * @param boolean closeClient close the connection after fetching document
 * @returns Document object or null
 */
export async function getDocument(id) {
    try {
        const documents = await getDocuments({_id: new ObjectId(id)});
        return documents[0] || null;
    } catch {
        return null;
    }
}

/**
 * Save a document to the database
 * @param {} document
 * @returns Document id or null
 */
export async function createDocument(document) {
    
    try {
        const collection = client.db("SSREditor").collection("Documents")
        const result = await collection.insertOne(document);
        return result.insertedId?.toString() || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Update the document with id
 * @param string id
 * @param {} document
 * @returns number of matched documents or null
 */
export async function updateDocument(id, document) {
    
    try {
        const collection = client.db("SSREditor").collection("Documents")
        const objectId = new ObjectId(id);
        // update
        const result = await collection.updateOne({_id: objectId}, {$set: document});

        return result.matchedCount;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * 
 * @param string id 
 * @param boolean closeClient close the connection after deleting document
 * @returns number of deleted documents
 */
export async function deleteDocument(id) {
    try {
        const collection = client.db("SSREditor").collection("Documents")
        const result = await collection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount || 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

