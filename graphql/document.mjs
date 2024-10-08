import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import GraphQLISODate from './customDate.mjs';

const DocumentType = new GraphQLObjectType({
    name: "Document",
    description: 'Represents a document',
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString) },
        // content can be null
        content: { type: GraphQLString },
        // created_at: { type: new GraphQLNonNull(GraphQLString)},
        created_at: { type: new GraphQLNonNull(GraphQLISODate)},
    })
})

export default DocumentType