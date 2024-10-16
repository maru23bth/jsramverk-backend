
import { updateDocument } from './db/documentCollection.mjs'

let timeoutTitle;
let timeoutContent;


function updateContentUseThrottling(documentId, content, socket) {
    clearTimeout(timeoutContent);
    timeoutContent = setTimeout(async () => {
        try {
        await updateDocument(documentId, {
            content: content,
            lastModified: new Date()
        });
        socket.emit('document-saved');
        } catch (error) {
            console.log(error)
        }
    }, 2000);
}


function updateTitleUseThrottling(documentId, title, socket) {
    clearTimeout(timeoutTitle);
    timeoutTitle = setTimeout(async () => {
        try {
        await updateDocument(documentId, {
            title: title,
            lastModified: new Date()
        });
        socket.emit('document-saved');
        } catch (error) {
            console.log(error);
        }
    }, 2000);
}

export { updateContentUseThrottling, updateTitleUseThrottling };