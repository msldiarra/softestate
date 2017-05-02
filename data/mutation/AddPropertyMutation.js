import {  GraphQLFloat, GraphQLList, GraphQLInt,  GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {  mutationWithClientMutationId } from 'graphql-relay';
import { DB }from '../database';
import {viewerType} from '../type/Types'
import _ from 'lodash';



export default mutationWithClientMutationId({
    name: 'AddProperty',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLInt) },
        reference: { type: new GraphQLNonNull(GraphQLString) },
        propertyType: { type: new GraphQLNonNull(GraphQLInt) },
        contractType: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: GraphQLString },
        price: { type: GraphQLInt },
        floorCount: { type: GraphQLInt },
        roomCount: { type: GraphQLInt },
        size: { type: GraphQLFloat },
        location: { type: GraphQLString },
        ownerRef: { type: new GraphQLNonNull(GraphQLString) },
        mediaNames: { type: new GraphQLList(GraphQLString) }
    },
    outputFields: {
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => DB.models.user.findOne({where: {id: viewerId}}),
        }
    },
    mutateAndGetPayload: ({viewerId, name, reference, propertyType, contractType, description, ownerRef, mediaNames, price, floorCount, roomCount, size, location}) => {

        var sanitizedMediaNames = _.map(mediaNames, name => {
            return sanitize(name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, '') )
        });


        return DB.models.owner.findOne({where: {reference: ownerRef}})
            .then((owner) =>
                owner.createProperty({
                        reference: reference,
                        type_id: propertyType
                    }
                )
            ).then((property) => {

                property.createPropertyPropertyContract({
                    property_id: property.id,
                    property_contract_id: contractType
                });

                if(description) {
                    property.createPropertyDescription({
                        property_id: property.id,
                        description: description
                    });
                }

                if(price) {
                    property.createPropertyPrice({
                        property_id: property.id,
                        price: price
                    });
                }

                if(floorCount) {
                    property.createPropertyFloorCount({
                        property_id: property.id,
                        count: floorCount
                    });
                }

                if(roomCount) {
                    property.createPropertyRoomCount({
                        property_id: property.id,
                        count: roomCount
                    });
                }

                if(size) {
                    property.createPropertySize({
                        property_id: property.id,
                        size: size
                    });
                }

                if(location) {

                    let location_id = DB.models.location.findOne({where: {city: location}}).get('id');

                    property.createPropertyLocation({
                        property_id: property.id,
                        location_id: location_id
                    });
                }

                return property;

            })
            .then((property) => {

                if(sanitizedMediaNames.length > 0) {
                    DB.models.media.findAll({where: {name: {in: sanitizedMediaNames}}})
                        .then((media) => {
                            if(media) {
                                property.addMedia(media);
                            }
                        });

                }

                return property;
            })
            .catch(error => {
                console.log(error)
                throw error;
            })
            .then((property) => {
                return {
                    viewerId: viewerId,
                    property: property
                };
            })
    }
});
