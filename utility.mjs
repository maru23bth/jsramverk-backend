
import { updateDocument } from './db/mongodb.auth.mjs'

let updateTimeout;

export default function updateDocumentUseThrottling(documentId, newData, socket) {
    clearTimeout(updateTimeout);

    updateTimeout = setTimeout(async () => {
        try {
            // Send the updated document data to be saved
            await updateDocument(socket.user, documentId, newData);
            // Emit an event to notify that the document was saved
            socket.emit('document-saved');
        } catch (error) {
            console.error('Error updating document:', error);
        }
    }, 2000);
}