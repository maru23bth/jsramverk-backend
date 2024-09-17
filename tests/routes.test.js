import request from 'supertest';
import { close } from '../db/mongodb.mjs';
//import app from '../app.mjs';
const app = require("../app.mjs").app;

afterAll(async () => {
  await close(); // Close DB
  app.close(); // Close server
});

let documentId;

describe('HTTP', () => {
  it('should get /', async () => {
    const res = await request(app).get('/');

      expect(res.statusCode).toEqual(200);
    //expect(JSON.parse(res.body)).toBeInstanceOf(Array)
  })

  it('should post /documents', async () => {
    const res = await request(app).post('/documents').send({ title: 'Test Document', content: 'This is a test document' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.title).toEqual('Test Document');
      documentId = res.body.id; // Save document id
  })

  it('should get /documents', async () => {
    const res = await request(app).get('/documents');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array)
  })

  it('should get /documents/:id', async () => {
    const res = await request(app).get(`/documents/${documentId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.id).toEqual(documentId);
      expect(res.body.title).toEqual('Test Document');
  })

  it('should delete /documents/:id', async () => {
    const res = await request(app).delete(`/documents/${documentId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual('Document deleted');
  })

})
