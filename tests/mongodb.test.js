import * as db from '../db/mongodb.mjs';


beforeAll(async () => {
    await db.connect();
  });
  
  afterAll(async () => {
    await db.close();
  });

let documentId;

// Test createDocument
describe('MongoDB Test', () => {

    it('should test that createDocument returns a string', async () => {
        const document = { title: 'Test Document', content: 'This is a test document' };
        documentId = await db.createDocument(document);
        expect(typeof documentId).toBe('string');
    })


    it('should test that createDocument without title fails', async () => {
        const document = { content: 'This is a test document' };
        const documentId = await db.createDocument(document);
        expect(documentId).toBeNull();
    })

    it('should test that getDocuments returns an array', async () => {
        
        const documents = await db.getDocuments();
        expect(Array.isArray(documents)).toBe(true);
        expect(documents.length).toBeGreaterThan(0);
    })

    it('should test that getDocument returns a document', async () => {
        const document = await db.getDocument(documentId);
        expect(document).toBeTruthy();
        expect(document.id).toBe(documentId);
        expect(document.title).toBe('Test Document');
    })

    it('should test that updateDocument returns 1', async () => {
        const result = await db.updateDocument(documentId, { title: 'Updated Test Document' });
        expect(result).toBe(1);
    })

    it('should test that getDocument returns a updated document', async () => {
        const document = await db.getDocument(documentId);
        expect(document).toBeTruthy();
        expect(document.id).toBe(documentId);
        expect(document.title).toBe('Updated Test Document');
        expect(document.content).toBe('This is a test document');
    })

    it('should test that updateDocument content returns 1', async () => {
        const result = await db.updateDocument(documentId, { content: 'This is a updated test document' });
        expect(result).toBe(1);
    })

    it('should test that getDocument returns a updated document', async () => {
        const document = await db.getDocument(documentId);
        expect(document).toBeTruthy();
        expect(document.id).toBe(documentId);
        expect(document.title).toBe('Updated Test Document');
        expect(document.content).toBe('This is a updated test document');
    })

    it('should test that deleteDocument returns 1', async () => {
        const result = await db.deleteDocument(documentId);
        expect(result).toBe(1);
    })
})

