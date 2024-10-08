import { GraphQLScalarType, Kind } from 'graphql';

const GraphQLISODate = new GraphQLScalarType({
    name: 'ISODate',
    description: 'ISO 8601 Date scalar type',
    parseValue(value) {
        return new Date(value); // value from the client
    },
    serialize(value) {
        return value.toISOString(); // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value); // ast value is always in string format
    }
        return null;
    },
});

export default GraphQLISODate
