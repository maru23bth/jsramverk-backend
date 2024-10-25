import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "./user.mjs";
import CommentType from "./comment.mjs";

const DocumentType = new GraphQLObjectType({
    name: "Document",
    fields: () => ({
        id: { type: GraphQLString },
        type: { type: GraphQLString },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        collaborators: { type: new GraphQLList(UserType) },
        comments: { type: new GraphQLList(CommentType)}
    })
})

export default DocumentType