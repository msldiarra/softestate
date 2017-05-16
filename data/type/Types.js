import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLFloat, GraphQLScalarType, GraphQLError, Kind } from 'graphql';
import { connectionArgs, connectionFromPromisedArray, globalIdField, nodeDefinitions, fromGlobalId, connectionDefinitions} from 'graphql-relay';
import { DB, User, Contact, Login, ContactInfo, Customer, Owner, Property, PropertyType, OwnerType, Media, Places }from '../database';
import { Viewer, getViewer } from '../store/UserStore';
import moment from 'moment';


export const {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {

        let {type, id} = fromGlobalId(globalId);

        console.log("globalId of " + type + " : " + globalId)
        console.log("id of " + type + " : " + id)


        if (type === 'User') { return DB.models.user.findOne({where: {id: id}}); }
        if (type === 'Contact') { return DB.models.contact.findOne({where: {id: id}}); }
        if (type === 'ContactInfo') { return DB.models.contact_info.findOne({where: {id: id}}); }
        if (type === 'Login') { return DB.models.login.findOne({where: {id: id}}); }
        if (type === 'Customer') { return DB.models.customer.findOne({where: {id: id}}); }
        if (type === 'Owner') { return DB.models.owner.findOne({where: {id: id}}); }
        if (type === 'Plaes') { return DB.models.places.findOne({where: {id: id}}); }
        if (type === 'Property') { return DB.models.property.findOne({where: {id: id}}); }
        if (type === 'PropertyType') { return DB.models.property_type.findOne({where: {id: id}}); }
        if (type === 'Media') { return DB.models.media.findOne({where: {id: id}}); }
        if (type === 'OwnerType') { return DB.models.owner_type.findOne({where: {id: id}}); }
        if (type === 'Viewer') { return getViewer(id)}
        else { return null; }
    },
    (obj) => {

        console.log("in interface obj: " + JSON.stringify(obj))

        
        if (obj instanceof User.Instance) { return userType; }
        else if (obj instanceof Contact.Instance) { return contactType; }
        else if (obj instanceof Login.Instance) { return loginType; }
        else if (obj instanceof ContactInfo.Instance) { return contactInfoType; }
        else if (obj instanceof Customer.Instance) { return customerType; }
        else if (obj instanceof Owner.Instance) { return ownerType; }
        else if (obj instanceof Places.Instance) { return placeTypeType; }
        else if (obj instanceof Property.Instance) { return propertyType; }
        else if (obj instanceof PropertyType.Instance) { return propertyTypeType; }
        else if (obj instanceof Media.Instance) { return mediaType; }
        else if (obj instanceof OwnerType.Instance) { return ownerTypeType; }
        else if (obj.id.startsWith('me')) { return viewerType; }
        else {
            return null;
        }
    }
);

export const GraphQLMoment = new GraphQLScalarType({
    name: 'Date',
    serialize: function (value) {
        let date = moment(value);
        if(!date.isValid()) {
            throw new GraphQLError('Field serialize error: value is an invalid Date');
        }
        return date.format();
    },
    parseValue: function (value) {
        let date = moment(value);
        if(!date.isValid()) {
            throw new GraphQLError('Field parse error: value is an invalid Date');
        }
        return date;
    },

    parseLiteral: (ast) => {
        if(ast.kind !== Kind.STRING) {
            throw new GraphQLError('Query error: Can only parse strings to date but got: ' + ast.kind);
        }
        let date = moment(ast.value);
        if(!date.isValid()) {
            throw new GraphQLError('Query error: Invalid date');
        }
        return date;
    }
});

export const contactInfoType =  new GraphQLObjectType({
    name: 'ContactInfo',
    fields: () => {
        return {
            id: globalIdField('ContactInfo'),
            phone: { type: GraphQLString, resolve(contactInfo) { return contactInfo.phone } }
        }
    },
    interfaces: () => [nodeInterface]
})

export const contactType = new GraphQLObjectType({
    name: 'Contact',
    fields: () => {
        return {
            id: globalIdField('Contact'),
            first_name: { type: GraphQLString, resolve(contact) { return contact.first_name } },
            last_name: { type: GraphQLString, resolve(contact) { return contact.last_name } },
            info: {type: contactInfoType, resolve(contact) {return contact.getContactInfo().then(infos => infos ? infos[0]: {})}},
            credentials: { type: new GraphQLList(loginType), resolve(contact) { return contact.getLogins() } }
        }
    },
    interfaces: () => [nodeInterface]
});

export const customerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => {
        return {
            id: globalIdField('Customer'),
            name: { type: GraphQLString, resolve(customer) { return customer.name } },
            contacts: { type: new GraphQLList(contactType), resolve(customer) { return customer.getContacts() } }
        }
    },
    interfaces: () => [nodeInterface]
});

export const loginType =new GraphQLObjectType({
    name: 'Login',
    fields: () => {
        return {
            id: globalIdField('Login'),
            login: { type: GraphQLString, resolve(login) { return login.login } },
            password: { type: GraphQLString, resolve(login) { return login.password } },
            enabled: { type: GraphQLBoolean, resolve(login) { return login.enabled } }
        }
    },
    interfaces: () => [nodeInterface]
});

export const mediaType = new GraphQLObjectType({
    name: 'Media',
    fields: () => ({
        id: globalIdField('Media'),
        uri: {
            type: GraphQLString,
            description: 'Media uri',
            resolve(mediaType) { return mediaType.uri }
        },
        name: {
            type: GraphQLString,
            description: 'Media name',
            resolve(mediaType) { return mediaType.name }
        },
        mime_type: {
            type: GraphQLString,
            description: 'Media mime type',
            resolve(mediaType) { return mediaType.mime_type }
        },
    }),
    interfaces: () => [nodeInterface]
});

export const ownerType = new GraphQLObjectType({
    name: 'Owner',
    fields: () => {
        return {
            id: globalIdField('Owner'),
            reference: { type: GraphQLString, resolve(owner) { return owner.reference } },
            company: { type: GraphQLString,
                resolve(owner) {
                    return DB.models.owner_company_name.findOne({where: {owner_id: owner.id}})
                        .then(owner_company_name => {
                            return owner_company_name? owner_company_name.get('name') : '';
                        });
                }
            },
            type: { type: GraphQLString, resolve(owner) { return DB.models.owner_type.findOne({where: {id: owner.type_id}})
                .then(owner_type =>  {
                    if(owner_type) owner_type.get('label')
                }  )
            }},
            type_id: { type: GraphQLInt, resolve(owner) { return owner.type_id}},
            contact: { type: contactType, resolve(owner) { return DB.models.owner_contact.findAll({where: {owner_id: owner.id}})
                .then(owner_contact => {
                    if(owner_contact.length > 0) return DB.models.contact.findAll({where: {id: owner_contact[0].contact_id}})
                })
                .then( contacts => contacts ? contacts[0] : {} ) } },
            properties : {
                type: propertyConnection,
                description: "An owner's collection of properties",
                args: connectionArgs,
                resolve: (owner, args) => connectionFromPromisedArray(owner.getProperties(), args)
            }
        }
    },
    interfaces: () => [nodeInterface]
});

export const placeType = new GraphQLObjectType({
    name: 'Location',
    fields: () => {
        return {
            id: globalIdField('Place'),
            country: { type: GraphQLString, resolve(place) { return place.country } },
            city: { type: GraphQLString, resolve(place) { return place.city } },
            neighborhood: { type: GraphQLString, resolve(place) { return place.neighborhood }},
            searchTerms: { type: GraphQLString, resolve(place) { return place.searchTerms } },
        }
    },
    interfaces: () => [nodeInterface]
});

export const ownerTypeType = new GraphQLObjectType({
    name: 'OwnerType',
    fields: () => {
        return {
            id: globalIdField('OwnerType'),
            label: { type: GraphQLString, resolve(ownerType) { return ownerType.label } }
        }
    },
    interfaces: () => [nodeInterface]
});

export const propertyType = new GraphQLObjectType({
    name: 'Property',
    fields: () => {
        return {
            id: globalIdField('Property'),
            name: { type: GraphQLString, resolve(property) { return property.name } },
            reference: { type: GraphQLString, resolve(property) { return property.reference } },
            enabled: { type: GraphQLBoolean, resolve(property) { return property.enabled } },
            date: { type: GraphQLMoment, resolve(property) { return GraphQLMoment.serialize(property.start_date)} },
            type_label: { type: GraphQLString, resolve(property) { return DB.models.property_type.findOne({where: {id: property.type_id}})
                .then(property_type =>  {
                    if(property_type) return property_type.get('label')
                })
            }},
            type_id: { type: GraphQLInt, resolve(property) { return property.type_id}},
            contract_type: { type: GraphQLInt, resolve(property) {
                return DB.models.property_property_contract.findOne({where :{property_id: property.type_id } })
                    .then(contract_type => {
                        if(contract_type) return contract_type.get('id');
                    })
            }},
            description: { type: GraphQLString, resolve(property) { return DB.models.property_description.findOne({where :{property_id: property.id } })
                .then(property_description => {
                    if(property_description) return property_description.get('description');
                })
            }},
            size: { type: GraphQLInt, resolve(property) { return DB.models.property_size.findOne({where :{property_id: property.id } })
                .then(property_size => {
                    if(property_size) return property_size.get('size');
                })
            }},
            size_unit: { type: GraphQLString, resolve(property) { return DB.models.property_size.findOne({where :{property_id: property.id } })
                .then(property_size => {
                    if(property_size) return DB.models.size_unit.findOne({where :{id: property_size.size_unit_id } })
                        .then(size_unit => {
                            if(size_unit) return size_unit.get('unit');
                    })
                })
            }},
            floor_count: { type: GraphQLFloat, resolve(property) { return DB.models.property_floor_count.findOne({where :{property_id: property.id } })
                .then(property_floor_count => {
                    if(property_floor_count) return property_floor_count.get('count');
                })
            }},
            room_count: { type: GraphQLFloat, resolve(property) { return DB.models.property_room_count.findOne({where :{property_id: property.id } })
                .then(property_room_count => {
                    if(property_room_count) return property_room_count.get('count');
                })
            }},
            price: { type: GraphQLInt, resolve(property) { return DB.models.property_price.findOne({where :{property_id: property.id } })
                .then(property_price => {
                    if(property_price) return property_price.get('price');
                })
            }},
            location: { type: GraphQLString, resolve(property) { return DB.models.property_location.findOne({where :{property_id: property.id } })
                .then(property_location => {
                    if(property_location) {
                        return DB.models.location.findOne({where :{id: property_location.location_id } }).get('city')
                    }
                })
            }},
            city: { type: GraphQLString, resolve(property) { return DB.models.property_location.findOne({where :{property_id: property.id } })
                .then(property_location => {
                    if(property_location) return DB.models.location.findOne({where :{id: property_location.location_id } }).get('city')
                })
            }},
            agency: { type: GraphQLString, resolve(property) { return DB.models.property.findOne({where :{id: property.id }})
                .then(property => property.getOwners())
                .then(owners => owners[0].getCustomers())
                .then(customers => customers[0].name )
            }},
            contact_phone: { type: GraphQLString, resolve(property) { return DB.models.property.findOne({where :{id: property.id }})
                .then(property => property.getOwners())
                .then(owners => owners[0].getCustomers())
                .then(customers => customers[0].getContacts() )
                .then(contacts => contacts[0].getContactInfos() )
                .then(contact_infos => contact_infos[0].phone )
            }},
            neighborhood: { type: GraphQLString, resolve(property) { return DB.models.property_neighborhood.findOne({where :{property_id: property.id } })
                .then(property_neighborhood => {
                    if(property_neighborhood) {
                        return DB.models.neighborhood.findOne({where :{id: property_neighborhood.neighborhood_id }}).get('name')
                    }
                })
            }},
            owner: { type: ownerType, resolve(property) { return DB.models.owner_property.findOne({where :{property_id: property.id }})
                .then(owner_property =>
                    DB.models.owner.findOne({where:  {id: owner_property.owner_id}}))
            } },
            media: {
                type: mediaConnection,
                description: "A property's collection of images",
                args: connectionArgs,
                resolve: (property, args) => {
                    return connectionFromPromisedArray(DB.models.property.findOne({where:  {id: property.id}})
                        .then(property => property.getMedia()) ,
                        args)
                }
            }
        }
    },
    interfaces: () => [nodeInterface]
});

export const propertyTypeType = new GraphQLObjectType({
    name: 'PropertyType',
    fields: () => {
        return {
            id: globalIdField('PropertyType'),
            label: { type: GraphQLString, resolve(propertyTypeType) { return propertyTypeType.label } }
        }
    },
    interfaces: () => [nodeInterface]
});

export const userType = new GraphQLObjectType({
    name: 'User',
    description: 'A user credentials',
    fields: () => {
        return {
            id: globalIdField('UserType'),
            firstName: { type: GraphQLString, resolve: (obj) => obj.first_name },
            lastName: { type: GraphQLString, resolve: (obj) => obj.last_name },
            login: { type: GraphQLString, resolve: (obj) => obj.login },
            email: { type: GraphQLString, resolve: (obj) => obj.email },
            enabled: { type: GraphQLBoolean, resolve: (obj) => obj.enabled },
            customer: { type: GraphQLString, resolve(user) { return user.customer} },
            contact: { type: contactType, resolve(user) { return DB.models.contact.findOne({where: {id: user.id}}) } },
            owners: {
                type: ownerConnection,
                description: "A customer's collection of owners",
                args: {
                    ...connectionArgs,
                    search: {
                        name: 'search',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (user, args) => {
                    var term = args.search? args.search + '%' : '';
                    let where = term ? " WHERE o.reference like '"+ term + "' " +
                    " OR ocn.name like '"+ term + "' " +
                    " OR c.last_name like '"+ term + "' " : " WHERE o.reference like '' ";

                    return connectionFromPromisedArray(DB.query('SELECT o.* FROM owner o' +
                        ' LEFT JOIN owner_contact oc ON oc.owner_id = o.id' +
                        ' LEFT JOIN owner_company_name ocn ON ocn.owner_id = o.id' +
                        ' LEFT JOIN customer_owner co ON co.owner_id = o.id' +
                        ' LEFT JOIN customer cu ON cu.id = co.customer_id' +
                        ' LEFT JOIN contact c ON c.id = oc.contact_id' +
                        where +
                        " AND customer.name = '" + user.customer + "' ",
                        {type: DB.QueryTypes.SELECT}), args)
                }
            },
            properties : {
                type: propertyConnection,
                description: "An owner's collection of properties",
                args: {
                    ...connectionArgs,
                    reference: {
                        name: 'reference',
                        type: GraphQLString
                    },
                    city: {
                        name: 'city',
                        type: GraphQLString
                    },
                    contract_type: {
                        name: 'contract_type',
                        type: GraphQLInt
                    }
                },
                resolve: (user, args) => {

                    var reference ='',
                        city_term = '',
                        contract_type = '',
                        city_where_term = '';


                    if(args.reference) { reference = " AND LOWER(reference) = LOWER('" +args.reference + "')" ; }
                    if(args.contract_type) { contract_type = " AND ppc.property_contract_id = '" +args.contract_type + "'" ; }
                    if(args.city) {
                        city_term = " INNER JOIN property_location pl ON pl.property_id = p.id" +
                            " INNER JOIN location l ON l.id = pl.location_id ";
                        city_where_term = " AND LOWER(l.city) = LOWER('" +args.city + "')";
                    }


                    return connectionFromPromisedArray(DB.query('SELECT p.* FROM property p ' +
                        city_term +
                        ' LEFT JOIN property_property_contract ppc ON ppc.property_id = p.id' +
                        ' WHERE p.id in ' +
                        '(SELECT property_id FROM owner_property op ' +
                        ' LEFT JOIN customer_owner co ON co.owner_id = op.owner_id' +
                        ' LEFT JOIN customer c ON c.id = co.customer_id' +
                        " WHERE c.name = '"+ user.customer +"') "
                        + reference
                        + contract_type
                        + city_where_term
                        + ' ORDER BY p.start_date DESC',
                        {type: DB.QueryTypes.SELECT}), args)
                }

            }
        }
    },
    interfaces: [nodeInterface]
});

export const viewerType = new GraphQLObjectType({
    name: 'Viewer',
    description: 'Application viewer',
    fields: () => {
        return {
            id: globalIdField('Viewer'),
            user: { type:  userType, resolve: (obj) => {
                if(obj.userId) return DB.models.user.findOne({where: {id: obj.userId}})
            } },
            owners: {
                type: ownerConnection,
                description: "A customer's collection of owners",
                args: {
                    ...connectionArgs,
                    search: {
                        name: 'search',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (_, args) => {
                    var term = args.search? args.search + '%' : '';
                    let where = term ? " WHERE o.reference like '"+ term + "' " +
                            " OR ocn.name like '"+ term + "' " +
                            " OR c.last_name like '"+ term + "' " :
                        " WHERE o.reference like '' ";

                    return connectionFromPromisedArray(DB.query('SELECT o.* FROM owner o' +
                        ' LEFT JOIN owner_contact oc ON oc.owner_id = o.id' +
                        ' LEFT JOIN owner_company_name ocn ON ocn.owner_id = o.id' +
                        ' LEFT JOIN contact c ON c.id = oc.contact_id' +
                        where,
                        {type: DB.QueryTypes.SELECT}), args)
                }
            },
            places: {
                type: placeConnection,
                description: "List of available locations",
                args: {
                    ...connectionArgs,
                    search: {
                        name: 'search',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (_, args) => {
                    var term = args.search? args.search + '%' : '';
                    return connectionFromPromisedArray(DB.models.places.findAll({
                        where: {search_terms: {$like: term} },
                        order: '"city"'
                    }), args)
                }
            },
            properties : {
                type: propertyConnection,
                description: "An owner's collection of properties",
                args: {
                    ...connectionArgs,
                    reference: {
                        name: 'reference',
                        type: GraphQLString
                    },
                    city: {
                        name: 'city',
                        type: GraphQLString
                    },
                    contract_type: {
                        name: 'contract_type',
                        type: GraphQLInt
                    }
                },
                resolve: (_, args) => {

                    var reference ='',
                        city_term = '',
                        contract_type = '',
                        city_where_term = '';


                    if(args.reference) { reference = " AND LOWER(reference) = LOWER('" +args.reference + "')" ; }
                    if(args.contract_type) { contract_type = " AND ppc.property_contract_id = '" +args.contract_type + "'" ; }
                    if(args.city) {
                        city_term = " INNER JOIN property_location pl ON pl.property_id = p.id" +
                                    " INNER JOIN location l ON l.id = pl.location_id ";
                        city_where_term = " AND LOWER(l.city) = LOWER('" +args.city + "')";
                    }


                    return connectionFromPromisedArray(DB.query('SELECT p.* FROM property p ' +
                        city_term +
                        ' LEFT JOIN property_property_contract ppc ON ppc.property_id = p.id' +
                        ' WHERE p.id in ' +
                        '(SELECT property_id FROM owner_property op ' +
                        ' LEFT JOIN customer_owner co ON co.owner_id = op.owner_id' +
                        ' LEFT JOIN customer c ON c.id = co.customer_id' +
                        ' ) '
                        + reference
                        + contract_type
                        + city_where_term
                        + ' ORDER BY p.start_date DESC',
                        {type: DB.QueryTypes.SELECT}), args)
                }

            }
        }
    },
    interfaces: [nodeInterface]
});

export const {connectionType: propertyConnection} =
    connectionDefinitions({
        name: 'Properties',
        nodeType: propertyType
    });

export const {connectionType: ownerConnection, edgeType : ownerEdge} =
    connectionDefinitions({
        name: 'Owners',
        nodeType: ownerType
    });


export const {connectionType: mediaConnection, edgeType : mediaEdge} =
    connectionDefinitions({
        name: 'Medias',
        nodeType: mediaType
    });

export const {connectionType: placeConnection} =
    connectionDefinitions({
        name: 'Places',
        nodeType: placeType
    });



