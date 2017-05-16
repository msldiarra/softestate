import { GraphQLNonNull, GraphQLObjectType, GraphQLInt} from 'graphql'
import { connectionArgs } from 'graphql-relay';
import {viewerType, nodeField} from './Types'
import {DB} from '../database'
import { VIEWER_ID, registerViewerId } from '../store/UserStore';
import Chance from 'chance';



export default new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField,
        // Add your own root fields here
        viewer: {
            type: viewerType,
            args: { viewerId: { name: 'viewerId', type: GraphQLInt} },
            resolve: (root, {viewerId}) => {

                var viewer = {id: VIEWER_ID + new Chance().word({length: 12}), userId: viewerId};
                registerViewerId(viewer);
                return viewer
            }
        }
    })
});