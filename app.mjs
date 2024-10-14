import 'dotenv/config'
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import documentsRoutes from './routes/documents.mjs';
import showdown from 'showdown';
import fs from 'fs';

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import socketHandler from './socketHandler.mjs';

const port = process.env.PORT || 1337;

export const app = express();
const httpServer = createServer(app);

app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/documents', documentsRoutes);

const clientDev = 'http://localhost:3000';
const clientProd = 'https://www.student.bth.se/~maru23/editor';
const client = process.env.NODE_ENV === 'production' ? clientProd : clientDev;
const io = new Server(httpServer, {
  cors: {
    origin: client
  }
});

// Use the socket handler
socketHandler(io);


const server = httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  const readmeContent = fs.readFileSync('README.md', 'utf8');
  const converter = new showdown.Converter({completeHTMLDocument: true});
  res.send(converter.makeHtml(readmeContent));
});

app.close = () => {
  server.close();
  console.log("HTTP server closed.");
}

process.on("SIGTERM", app.close);