import { updateContentUseThrottling, updateTitleUseThrottling } from './utility.mjs'


export default function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('my-create-room', (documentId) => {
            socket.join(documentId);
        });

        socket.on('document-content-change', ({ documentId, content }) => {

            socket.to(documentId).emit('document-content-change', { documentId, content });

            updateContentUseThrottling(documentId, content, socket);
        });

        socket.on('document-title-change', ({ documentId, title }) => {

            socket.to(documentId).emit('document-title-change', { documentId, title });

            updateTitleUseThrottling(documentId, title, socket);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    }); 
}
