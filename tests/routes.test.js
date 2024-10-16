import request from 'supertest';
import { close } from '../db/mongodb.mjs';
//import app from '../app.mjs';
const app = require("../app.mjs").app;

afterAll(async () => {
  await close(); // Close DB
  app.close(); // Close server
});

let documentId;
let token;
let commentId;

describe('HTTP', () => {
  it('should get /', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
  })

  it('should get /documents without authentication', async () => {
    const res = await request(app).get('/documents');

    expect(res.statusCode).toEqual(401);
  })

  it('should authenticate', async () => {
    const res = await request(app).post('/auth/').send({ username: 'test@example.com', password: 'password' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.token).toBeDefined();
    token = res.body.token; // Save token for later use
  })

  it('should post /documents', async () => {
    const res = await request(app).post('/documents').send({ title: 'Test Document', content: 'This is a test document' }).set('x-access-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.title).toEqual('Test Document');
    documentId = res.body.id; // Save document id
  })

  it('should get /documents', async () => {
    const res = await request(app).get('/documents').set('x-access-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array)
  })

  it('should get /documents/:id', async () => {
    const res = await request(app).get(`/documents/${documentId}`).set('x-access-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.id).toEqual(documentId);
    expect(res.body.title).toEqual('Test Document');
  })

  // Comments
  it('should post /documents/:id/comment', async () => {
    const res = await request(app).post(`/documents/${documentId}/comment`).send({ content: 'Test comment', location: '10-20' }).set('x-access-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.comments).toBeInstanceOf(Array);
    expect(res.body.comments[0].content).toEqual('Test comment');
    commentId = res.body.comments[0].id; // Save comment id
  })

  it('should delete /documents/:id/comment/:commentId', async () => {
    const res = await request(app).delete(`/documents/${documentId}/comment/${commentId}`).set('x-access-token', token);
    expect(res.statusCode).toEqual(200);
  })

  // Collaborators
  it('should post /documents/:id/collaborator', async () => {
    const res = await request(app).post(`/documents/${documentId}/collaborator`).send({ userId: '67069a72d34e3e15302c1970' }).set('x-access-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.collaborators).toBeInstanceOf(Array);
    expect(res.body.collaborators.find(user => user.id == '67069a72d34e3e15302c1970').id).toEqual('67069a72d34e3e15302c1970');
  })
      
  it('should delete /documents/:id/collaborator', async () => {
    const res = await request(app).delete(`/documents/${documentId}/collaborator`).send({ userId: '67069a72d34e3e15302c1970' }).set('x-access-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.collaborators).toBeInstanceOf(Array);
    expect(res.body.collaborators.find(user => user.id == '67069a72d34e3e15302c1970')).toBeUndefined();
  })


  it('should delete /documents/:id', async () => {
    const res = await request(app).delete(`/documents/${documentId}`).set('x-access-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual('Document deleted');
  })

})
