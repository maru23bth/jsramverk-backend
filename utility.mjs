
import { updateDocument } from './db/documentCollection.mjs'


function updateContentUseThrottling(documentId, content, socket) {
    let timeoutContent;

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
    let timeoutTitle;

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