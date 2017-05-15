import { GraphQLNonNull, GraphQLObjectType, GraphQLInt} from 'graphql'
import { connectionArgs } from 'graphql-relay';
import {viewerType, nodeField} from './Types'
import {DB} from '../database'
import { VIEWER_ID, registerViewer, getViewer } from '../store/UserStore';



export default new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField,
        // Add your own root fields here
        viewer: {
            type: viewerType,
            args: { viewerId: { name: 'viewerId', type: GraphQLInt} },
            resolve: (root, {viewerId}) => {
                return {id: 'me'}
            }
        }
    })
});