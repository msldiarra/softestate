import {GraphQLInt,  GraphQLNonNull, GraphQLString} from 'graphql';
import {mutationWithClientMutationId} from 'graphql-relay';
import {DB} from '../database';
import {viewerType} from '../type/Types'
import {getViewer} from '../store/UserStore';

export default mutationWithClientMutationId({
    name: 'DeleteProperty',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        propertyId: { type: new GraphQLNonNull(GraphQLString) },
        propertyReference: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
        deletedPropertyID : {
            type: GraphQLString,
            resolve: ({propertyId}) => propertyId
        },
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => getViewer(viewerId),
        }
    },
    mutateAndGetPayload: ({viewerId, propertyId, propertyReference}) => {

        return DB.models.property.destroy({where: {reference: propertyReference }})
            .then(() => {
                return {
                    viewerId: viewerId,
                    propertyId: propertyId
                };
            })
    }
});
