import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLList, GraphQLString } from "graphql";
import DocumentType from "./document.mjs";
import { getDocument, getDocuments } from "../db/mongodb.mjs";

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        document: {
            type: DocumentType,
            description: 'A single document',
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: async function (parent, { id }) {
                const document = await getDocument(id)
                return document
            }
        },
        documents: {
            type: new GraphQLList(DocumentType),
            description: 'List of documents',
            resolve: async () => {
                const documents = await getDocuments()
                return documents
            }
        }
    })
})

export default RootQueryType