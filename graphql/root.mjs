import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLList, GraphQLString } from "graphql";
import DocumentType from "./document.mjs";
import { getDocument, getDocuments, getUserDocuments } from "../db/mongodb.auth.mjs"

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        getDocumentById: {
            type: DocumentType,
            description: 'A single document by id',
            args: { 
                id: { type: GraphQLString }
            },
            resolve: async function (parent, { id }, context) {
                console.log(`Context: ${context}`);
                const user = context.user;
                return await getDocument(user, id);
            }
        },
        getAllDocuments: {
            type: new GraphQLList(DocumentType),
            description: 'List of documents',
            resolve: async () => {
                return await getDocuments(); 
            }
        },
        getAllUserDocuments: {
            type: new GraphQLList(DocumentType),
            description: "List of all user's documents",
            resolve: async (parent, args, context) => {
                const user = context.user;
                return await getUserDocuments(user);
            }
        }
    })
})

export default RootQuery