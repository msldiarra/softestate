import {  GraphQLFloat, GraphQLList, GraphQLInt,  GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {  mutationWithClientMutationId } from 'graphql-relay';
import { DB } from '../database';
import _ from 'lodash';
import sanitize from 'sanitize-filename';
import {viewerType} from '../type/Types'



export default mutationWithClientMutationId({
    name: 'EditProperty',
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
    mutateAndGetPayload: ({viewerId, reference, propertyType, contractType, description, mediaNames, price, floorCount, roomCount, size, sizeUnit, city, neighborhood}) => {

        var sanitizedMediaNames = _.map(mediaNames, name => {
            return sanitize(name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, '') )
        });

        return DB.models.property.findOne({where: {reference: reference}})
            .then((property) =>
                property.updateAttributes({
                        reference: reference,
                        type_id: propertyType
                    }
                )
            ).then((property) => {

                DB.models.property_property_contract.findOne({where: {property_id: property.id}})
                    .then(property_property_contract => property_property_contract.updateAttributes({property_contract_id: contractType}));

                if(description)
                    DB.models.property_description.findOne({where: {property_id: property.id}})
                        .then(property_description => {
                            if(property_description) property_description.updateAttributes({description: description})
                            else property.createPropertyDescription({
                                property_id: property.id,
                                description: description
                            });
                        });

                if(price)
                    DB.models.property_price.findOne({where: {property_id: property.id}})
                        .then(property_price => {

                            if(property_price) property_price.updateAttributes({price: price})
                            else property.createPropertyPrice({
                                property_id: property.id,
                                price: price
                            });
                        });

                if(floorCount)
                    DB.models.property_floor_count.findOne({where: {property_id: property.id}})
                        .then(property_floor_count => {

                            if(property_floor_count) property_floor_count.updateAttributes({count: floorCount})
                            else property.createPropertyFloorCount({
                                property_id: property.id,
                                count: floorCount
                            });
                        });

                if(roomCount)
                    DB.models.property_room_count.findOne({where: {property_id: property.id}})
                        .then(property_room_count => {
                            if(property_room_count) property_room_count.updateAttributes({count: roomCount})
                            else property.createPropertyRoomCount({
                                property_id: property.id,
                                count: roomCount
                            });
                        });

                if(size)
                    DB.models.property_size.findOne({where: {property_id: property.id}})
                        .then(property_size => {
                            if(property_size) property_size.updateAttributes({
                                size: size,
                                size_unit_id: (sizeUnit == 'ha')? 2: 1
                                })
                            else property.createPropertySize({
                                property_id: property.id,
                                size: size,
                                size_unit_id: (sizeUnit == 'ha')? 2: 1
                            });
                        });


                if(city) {

                    DB.models.location.findOne({where: {city: city}})
                        .then(location =>

                        DB.models.property_location.findOne({where: {property_id: property.id}})
                            .then(property_location => {
                                if (property_location) {
                                    property_location.updateAttributes({location_id: location.id})
                                }
                                else {
                                    DB.models.location.findOne({where: {city: city}}).then(
                                        (location) => property.addLocation(location));
                                }
                            }))
                }

                if(neighborhood) {

                    DB.models.neighborhood.findOne({where: {name: neighborhood}})
                        .then(location =>

                        DB.models.property_neighborhood.findOne({where: {property_id: property.id}})
                            .then(property_neighborhood => {

                                if (property_neighborhood) {
                                    property_neighborhood.updateAttributes({neighborhood_id: location.id})
                                }
                                else {
                                    DB.models.neighborhood.findOne({where: {name: neighborhood}}).then(
                                        (neighborhood) => property.addNeighborhood(neighborhood)
                                    );
                                }
                            })
                        )
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
