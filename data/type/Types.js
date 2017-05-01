import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLFloat } from 'graphql';
import { connectionArgs, connectionFromPromisedArray, globalIdField, nodeDefinitions, fromGlobalId, connectionDefinitions} from 'graphql-relay';
import { DB, User, Contact, Login, ContactInfo, Customer, Owner, Property, PropertyType, OwnerType, Media }from '../database';
import { Viewer, getViewer } from '../store/UserStore';



export const {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {
        let {type, id} = fromGlobalId(globalId);
        if (type === 'User') { return DB.models.user.findOne({where: {id: id}}); }
        if (type === 'Contact') { return DB.models.contact.findOne({where: {id: id}}); }
        if (type === 'ContactInfo') { return DB.models.contact_info.findOne({where: {id: id}}); }
        if (type === 'Login') { return DB.models.login.findOne({where: {id: id}}); }
        if (type === 'Customer') { return DB.models.customer.findOne({where: {id: id}}); }
        if (type === 'Owner') { return DB.models.owner.findOne({where: {id: id}}); }
        if (type === 'Property') { return DB.models.property.findOne({where: {id: id}}); }
        if (type === 'PropertyType') { return DB.models.property_type.findOne({where: {id: id}}); }
        if (type === 'Media') { return DB.models.media.findOne({where: {id: id}}); }
        if (type === 'OwnerType') { return DB.models.owner_type.findOne({where: {id: id}}); }
        if (type === 'Viewer') { return getViewer(id)}
        else { return null; }
    },
    (obj) => {
        if (obj instanceof User.Instance) { return userType; }
        else if (obj instanceof Contact.Instance) { return contactType; }
        else if (obj instanceof Login.Instance) { return loginType; }
        else if (obj instanceof ContactInfo.Instance) { return contactInfoType; }
        else if (obj instanceof Customer.Instance) { return customerType; }
        else if (obj instanceof Owner.Instance) { return ownerType; }
        else if (obj instanceof Property.Instance) { return propertyType; }
        else if (obj instanceof PropertyType.Instance) { return propertyTypeType; }
        else if (obj instanceof Media.Instance) { return mediaType; }
        else if (obj instanceof OwnerType.Instance) { return ownerTypeType; }
        else if (obj instanceof Viewer) { return viewerType; }
        else {
            return null;
        }
    }
);

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
                        .then(company_name => {
                            return company_name? company_name.get('name') : '';
                        });
                }
            },
            type: { type: GraphQLString, resolve(owner) { return DB.models.owner_type.findOne({where: {id: owner.type_id}})
                .then(owner_type =>  {
                    if(owner_type) owner_type.get('label')
                }  )
            }},
            type_id: { type: GraphQLInt, resolve(owner) { return owner.type_id}},
            contact: { type: contactType, resolve(owner) { return owner.getContacts().then( contacts => contacts ? contacts[0] : {} ) } },
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
                .then(property_floor_count => {
                    if(property_floor_count) return property_floor_count.get('size');
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
            location: { type: GraphQLString, resolve(property) { return DB.models.property.findOne({where :{id: property.id } })
                .then(property => {
                    if(property) {
                        var locations = property.getLocations();
                        return (locations.length > 0) ? locations[0].get('city') : null;
                    }
                })
            }},
            city: { type: GraphQLString, resolve(property) { return DB.models.property_location.findOne({where :{property_id: property.id } })
                .then(property_location => {
                    if(property_location) return property_location.get('city');
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
            firstName: {
                type: GraphQLString,
                resolve: (obj) => obj.firstName
            },
            lastName: {
                type: GraphQLString,
                resolve: (obj) => obj.lastName
            },
            login: {
                type: GraphQLString,
                resolve: (obj) => obj.login
            },
            email: {
                type: GraphQLString,
                resolve: (obj) => obj.email
            },
            enabled: {
                type: GraphQLBoolean,
                resolve: (obj) => obj.enabled
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
            user: { type:  userType, resolve: (obj) => obj},
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
                resolve: (_, args) => {
                    var term = args.search? args.search + '%' : '';
                    return connectionFromPromisedArray(DB.models.owner.findAll({where: {reference: {$like: term} }}), args)
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
                    }
                },
                resolve: (_, args) => {

                    var term ='',
                        city_term = '',
                        city_where_term = '';

                    if(args.reference) { term = " AND reference = '" +args.reference + "'" ; }
                    if(args.city) {
                        city_term = " INNER JOIN property_location pl ON pl.property_id = p.id" +
                               " INNER JOIN location l ON l.id = pl.location_id ";
                        city_where_term = " AND LOWER(l.city) = LOWER('" +args.city + "')";

                    }


                    return connectionFromPromisedArray(DB.query('SELECT p.* FROM property p ' +
                        city_term +
                        ' WHERE p.id in ' +
                        '(SELECT property_id FROM owner_property op ' +
                        ' INNER JOIN customer_owner co ON co.owner_id = op.owner_id' +
                        ' INNER JOIN customer c ON c.id = co.customer_id' +
                        ' WHERE c.name = \'AIA-Mali SARL\') ' + term
                        + city_where_term,
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



