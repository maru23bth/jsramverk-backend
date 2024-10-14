import { updateDocument, getDocument } from './db/documentCollection.mjs'

let timeoutTitle;
let timeoutContent;

export default function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log("user connected")
        socket.on('my-create-room', (documentId) => {
            socket.join(documentId);
        });

        socket.on('document-content-change', ({ documentId, content }) => {

            socket.to(documentId).emit('document-content-change', { documentId, content });

            clearTimeout(timeoutContent);
            timeoutContent = setTimeout(async () => {
                try {
                updateDocument(documentId, {
                    content: content,
                    lastModified: new Date()
                })
                const res = await getDocument(documentId);
                console.log(res);
                } catch (error) {
                console.log(error)
                }
            }, 2000);
        });

        socket.on('document-title-change', ({ documentId, title }) => {


        socket.to(documentId).emit('document-title-change', { documentId, title });

            clearTimeout(timeoutTitle);
            timeoutTitle = setTimeout(async () => {
                try {
                await updateDocument(documentId, {
                    title: title,
                    lastModified: new Date()
                });
                const res = await getDocument(documentId);
                console.log(res);
                } catch (error) {
                console.log(error);
                }
            }, 2000);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    }); 
}
