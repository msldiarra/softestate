import { GraphQLNonNull, GraphQLObjectType, GraphQLInt} from 'graphql'
import { connectionArgs } from 'graphql-relay';
import {userType, nodeField} from './Types'
import {DB} from '../database'



export default new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField,
        // Add your own root fields here
        viewer: {
            type: userType,
            args: {
                userID: {
                    name: 'userID',
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: (root, {userID}) => DB.models.user.findOne({where: {id: userID}})
        },
    }),
});