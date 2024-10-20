import updateDocumentUseThrottling from './utility.mjs'
import { socketMiddlewareCheckToken } from './db/auth.mjs'


export default function socketHandler(io) {
    // Middleware authenticates user
    io.use( socketMiddlewareCheckToken );

    io.on('connection', (socket) => {
        console.log('User connected:', socket.user);

        socket.on('my-create-room', (documentId) => {
            socket.join(documentId);
        });

        /* Document Edit */

        socket.on('document-content-change', ({ documentId, content }) => {

            socket.to(documentId).emit('document-content-change', { documentId, content });

            updateDocumentUseThrottling(documentId, { content }, socket);
        });

        socket.on('document-title-change', ({ documentId, title }) => {

            socket.to(documentId).emit('document-title-change', { documentId, title });

            updateDocumentUseThrottling(documentId, { title }, socket);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    }); 
}
