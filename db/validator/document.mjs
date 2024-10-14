const documentValidator = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Document Object Validation",
            required: [ "title", "owner",],
            properties: {
                title: {
                    bsonType: "string",
                    description: "'title' must be a string and is required"
                },
                content: {
                    bsonType: "string",
                    description: "'content' must be a string"
                },
                owner: {
                    bsonType: "objectId",
                    description: "'owner' must be an objectId and is required"
                }
            }
        }
    }
}

export default documentValidator;

// {
//     title: title
//     content: content,
//     owner: 'Current user',
//     collaborators: [],
//     createdAt: new Date('2024-10-10'),
//     comments: [
//         {
//         commentId: 1,
//         text: 'comment',
//         userId: 1100,
//         createdAt: new Date(),
//         }
//     ],
//         lastModified: new Date.ISODate(),
// }