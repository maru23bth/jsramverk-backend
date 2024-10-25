import { GraphQLInterfaceType, GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "./user.mjs";

const CommentType = new GraphQLObjectType({
    name: "Comment",
    fields: () => ({
        id: { type: GraphQLString },
        author: { type: UserType },
        content: { type: GraphQLString},
        location: { type: GraphQLString }
    })
});

export default CommentType