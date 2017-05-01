import {GraphQLInt,  GraphQLNonNull, GraphQLString} from 'graphql';
import {mutationWithClientMutationId} from 'graphql-relay';
import {DB} from '../database';
import {viewerType} from '../type/Types'


export default mutationWithClientMutationId({
    name: 'DeleteProperty',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLInt) },
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
            resolve: ({viewerId}) => DB.models.user.findOne({where: {id: viewerId}}),
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
