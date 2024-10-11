import 'dotenv/config'
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import documentsRoutes from './routes/documents.mjs';
import showdown from 'showdown';
import fs from 'fs';

import { createServer } from 'node:http';
import { Server } from 'socket.io';


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

// console.log(client);
// The Server instance io
const io = new Server(httpServer, {
  cors: {
    origin: client
  }
});

let timeout;

// Handle Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected');

  // Connect to a room with id = documentId
  socket.on('my-create-room', (documentId) => {
    socket.join(documentId);
    // console.log('rooms', socket.rooms);
  });

  // Listen on change of the content
  socket.on('document-content-change', ({ documentId, content }) => {
    // to the room with id
    socket.to(documentId).emit('document-content-change', { documentId, content });
    // throtling
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      // update content to the database
    }, 2000);

  });

  socket.on('document-title-change', ({ documentId, title }) => {
    console.log('title', title);
    // to the room with id
    socket.to(documentId).emit('document-title-change', { documentId, title });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


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