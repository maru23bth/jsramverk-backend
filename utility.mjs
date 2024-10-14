
import { updateDocument, getDocument } from './db/documentCollection.mjs'



function updateContentUseThrottling(documentId, content) {
    let timeoutContent;

    clearTimeout(timeoutContent);
    timeoutContent = setTimeout(async () => {
        updateDocument(documentId, {
            content: content,
            lastModified: new Date()
        }).then(
        getDocument(documentId).then((res) => console.log(res)).catch((error) => console.log(error))
        ).catch((error) => console.log(error));
    }, 4000);
}


function updateTitleUseThrottling(documentId, title) {
    let timeoutTitle;

    clearTimeout(timeoutTitle);
    timeoutTitle = setTimeout(async () => {
        updateDocument(documentId, {
            title: title,
            lastModified: new Date()
        }).then(
        getDocument(documentId).then((res) => console.log(res)).catch((error) => console.log(error))
        ).catch((error) => console.log(error));
    }, 4000);
}

export { updateContentUseThrottling, updateTitleUseThrottling };