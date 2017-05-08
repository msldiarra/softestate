import {  GraphQLFloat, GraphQLList, GraphQLInt,  GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {  mutationWithClientMutationId } from 'graphql-relay';
import { DB }from '../database';
import {viewerType} from '../type/Types';
import _ from 'lodash';
import sanitize from 'sanitize-filename';



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
        sizeUnit: { type: GraphQLString },
        city: { type: GraphQLString },
        neighborhood: { type: GraphQLString },
        ownerRef: { type: new GraphQLNonNull(GraphQLString) },
        mediaNames: { type: new GraphQLList(GraphQLString) }
    },
    outputFields: {
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => DB.models.user.findOne({where: {id: viewerId}}),
        }
    },
    mutateAndGetPayload: ({viewerId, reference, propertyType, contractType, description, ownerRef, mediaNames, price, floorCount, roomCount, size, sizeUnit, city, neighborhood}) => {

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
                        size: size,
                        size_unit_id: (sizeUnit == 'ha')? 2: 1,
                    });
                }

                if(city) {

                    DB.models.location.findOne({where: {city: city}}).then(
                        (city) => property.addLocation(city)
                    );
                }

                if(neighborhood) {

                    DB.models.neighborhood.findOne({where: {name: neighborhood}}).then(
                        (neighborhood) => property.addNeighborhood(neighborhood)
                    );
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
