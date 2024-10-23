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

        /* Code Mode */

        socket.on('change-to-code-mode', ({ documentId, codeMode }) => {
            console.log("codeMode:", codeMode);
            socket.to(documentId).emit('change-to-code-mode', { documentId, codeMode });
        });

        socket.on('add-comment-code-mode', ({ documentId, location }) => {
            socket.to(documentId).emit('add-comment-code-mode', { documentId, location });
        });

        // when switched to code mode swith hos another user too
        // show all changes in real time
        // when deleted and added comments

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    }); 
}
