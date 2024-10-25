import { GraphQLObjectType, GraphQLString } from "graphql";

/* GraphQL Types These types map directly to your database collections. */
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString}
    })
});

export default UserType