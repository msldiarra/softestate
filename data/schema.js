import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from 'graphql';

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    connectionFromPromisedArray,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
} from 'graphql-relay';


import {
    DB,
    User,
    Contact,
    Login,
    ContactInfo,
    Customer,
    Owner,
    Property,
    PropertyType,
    OwnerType,
    SellSummary,
    RentSummary,
    Media

} from './database';
import _ from 'underscore';
import sanitize from 'sanitize-filename';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.AddOwnerMutation = undefined;


export var AppMessage = {id:0, text: ""};

var {nodeInterface, nodeField} = nodeDefinitions(
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
      if (type === 'SellSummary') { return DB.models.sell_summary.findOne({where: {id: id}}); }
      if (type === 'RentSummary') { return DB.models.rent_summary.findOne({where: {id: id}}); }
      if (type === 'AppMessage') { return _.findWhere(AppMessage, {id: id}); }
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
      else if (obj instanceof SellSummary.Instance) { return sellSummaryType; }
      else if (obj instanceof RentSummary.Instance) { return rentSummaryType; }
      else if (obj instanceof AppMessage.Instance) { return appMessageType; }
      else {
        return null;
      }
    }
);

/**
 * Define your own types here
 */

export const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A realestate agency customer',
  fields: () => {
    return {
      id: globalIdField('User'),
      customer: { type: GraphQLString, resolve(user) { return user.customer} },
      credentials: { type: loginType, resolve(user) { return DB.models.login.findOne({where: {login: user.login}}) } },
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
          }
        },
        resolve: (_, args) => {

          var term;

          if(args.reference) {
            term = {where: {reference: args.reference }}
          } else {
            term =  {}
          }

          return connectionFromPromisedArray(DB.models.property.findAll(term), args)
        }
      },
      message: { type: appMessageType, resolve() { return AppMessage } }
    }
  },
  interfaces: [nodeInterface]
});


const customerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => {
    return {
      id: globalIdField('Customer'),
      name: { type: GraphQLString, resolve(customer) { return customer.name } },
      contacts: { type: new GraphQLList(contactType), resolve(customer) { return customer.getContacts() } }
    }
  },
  interfaces: [nodeInterface]
});

const ownerTypeType = new GraphQLObjectType({
  name: 'OwnerType',
  fields: () => {
    return {
      id: globalIdField('OwnerType'),
      label: { type: GraphQLString, resolve(ownerType) { return ownerType.label } }
    }
  },
  interfaces: [nodeInterface]
});

const ownerType = new GraphQLObjectType({
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
      type: { type: GraphQLString, resolve(owner) { return DB.models.owner_type.findOne({where: {id: owner.type_id}}).get('label') } },
      type_id: { type: GraphQLInt, resolve(owner) { return owner.type_id}},
      contact: { type: contactType, resolve(owner) { return owner.getContacts().then( contacts => contacts ? contacts[0] : {} ) } },
      rentSummary: {
        type: rentSummaryType,
        description: "A customer's properties to rent summary",
        resolve(owner) { return owner.getRentSummary();}
      },
      sellSummary: {
        type: sellSummaryType,
        description: "A customer's properties to sell summary",
        resolve(owner) { return owner.getSellSummary();}
      },
      properties : {
        type: propertyConnection,
        description: "An owner's collection of properties",
        args: connectionArgs,
        resolve: (owner, args) => connectionFromPromisedArray(owner.getProperties(), args)
      }
    }
  },
  interfaces: [nodeInterface]
});

/* based on rentSummary view */
const rentSummaryType = new GraphQLObjectType({
  name: 'RentSummary',
  fields: () => {
    return {
      id: globalIdField('RentSummary'),
      apartmentCount: { type: GraphQLInt, resolve(rentSummary) { return rentSummary.apartment_count } },
      houseCount: { type: GraphQLInt, resolve(rentSummary) { return rentSummary.house_count } },
      landCount: { type: GraphQLInt, resolve(rentSummary) { return rentSummary.land_count } },
    }
  },
  interfaces: [nodeInterface]
});

/* based on sellSummary view */
const sellSummaryType = new GraphQLObjectType({
  name: 'SellSummary',
  fields: () => {
    return {
      id: globalIdField('SellSummary'),
      apartmentCount: { type: GraphQLInt, resolve(sellSummary) { return sellSummary.apartment_count } },
      houseCount: { type: GraphQLInt, resolve(sellSummary) { return sellSummary.house_count } },
      landCount: { type: GraphQLInt, resolve(sellSummary) { return sellSummary.land_count } },
    }
  },
  interfaces: [nodeInterface]
});


const contactType = new GraphQLObjectType({
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
  interfaces: [nodeInterface]
});

const loginType = new GraphQLObjectType({
  name: 'Login',
  fields: () => {
    return {
      id: globalIdField('Login'),
      login: { type: GraphQLString, resolve(login) { return login.login } },
      password: { type: GraphQLString, resolve(login) { return login.password } },
      enabled: { type: GraphQLBoolean, resolve(login) { return login.enabled } }
    }
  },
  interfaces: [nodeInterface]
});

const appMessageType = new GraphQLObjectType({
  name: 'AppMessage',
  fields: () => {
    return {
      id: globalIdField('AppMessage'),
      text: { type: GraphQLString, resolve(message) { return message.text } }
    }
  },
  interfaces: [nodeInterface]
});

const contactInfoType = new GraphQLObjectType({
  name: 'ContactInfo',
  fields: () => {
    return {
      id: globalIdField('ContactInfo'),
      phone: { type: GraphQLString, resolve(contactInfo) { return contactInfo.phone } }
    }
  },
  interfaces: [nodeInterface]
});


const propertyType = new GraphQLObjectType({
  name: 'Property',
  fields: () => {
    return {
      id: globalIdField('Property'),
      name: { type: GraphQLString, resolve(property) { return property.name } },
      reference: { type: GraphQLString, resolve(property) { return property.reference } },
      enabled: { type: GraphQLBoolean, resolve(property) { return property.enabled } },
      type_label: { type: GraphQLString, resolve(property) { return DB.models.property_type.findOne({where :{id: property.type_id } }).get('label')}},
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
      district: { type: GraphQLString, resolve(property) { return DB.models.property_location.findOne({where :{property_id: property.id } })
          .then(property_location => {
            if(property_location) return property_location.get('district');
          })
      }},
      city: { type: GraphQLString, resolve(property) { return DB.models.property_location.findOne({where :{property_id: property.id } })
          .then(property_location => {
            if(property_location) return property_location.get('city');
          })
      }},
      owner: { type: ownerType, resolve(property) { return property.getOwners().then( owners => owners[0]) }},
      media: {
        type: mediaConnection,
        description: "A property's collection of images",
        args: connectionArgs,
        resolve: (property, args) => {
          return connectionFromPromisedArray(property.getMedia(), args)
        }
      }
    }
  },
  interfaces: [nodeInterface]
});

export const propertyTypeType = new GraphQLObjectType({
  name: 'PropertyType',
  fields: () => {
    return {
      id: globalIdField('PropertyType'),
      label: { type: GraphQLString, resolve(propertyTypeType) { return propertyTypeType.label } }
    }
  },
  interfaces: [nodeInterface]
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
  interfaces: [nodeInterface]
});

/**!!
 * Define your own connection types here
 */

export var {connectionType: propertyConnection} =
    connectionDefinitions({name: 'Properties', nodeType: propertyType});

export var {connectionType: ownerConnection, edgeType : ownerEdge} =
    connectionDefinitions({name: 'Owners', nodeType: ownerType});

export var {connectionType: mediaConnection, edgeType : mediaEdge} =
    connectionDefinitions({name: 'Medias', nodeType: mediaType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
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

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */

var AddOwnerMutation = exports.AddOwnerMutation = mutationWithClientMutationId({
  name: 'AddOwner',
  inputFields: {
    viewerId: { type: new GraphQLNonNull(GraphQLInt) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    reference: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({viewerId}) => DB.models.user.findOne({where: {id: viewerId}})
    }

  },
  mutateAndGetPayload: ({viewerId, reference, company, firstName, lastName, phone, type}) => {

    var owner = {
      reference: reference,
      type_id: type
    };

    return DB.models.owner.create(owner).then((owner)  => {

      if(company){
        owner.createOwnerCompanyName({
          name: company
        })
      }

      if(firstName || lastName) {
        owner.createContact({
          first_name: firstName,
          last_name: lastName
        }).then(contact => {

          if(phone) {
            contact.createContactInfo({
              phone: phone
            })
          }
        })
        .catch(response => {

          console.log(response)
        });


      }

      return {
        viewerId: viewerId,
        owner: owner
      };

    });

  },
});

var EditOwnerMutation = exports.EditOwnerMutation = mutationWithClientMutationId({
  name: 'EditOwner',
  inputFields: {
    viewerId: { type: new GraphQLNonNull(GraphQLInt) },
    reference: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLInt) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({viewerId}) => DB.models.user.findOne({where: {id: viewerId}})
    }

  },
  mutateAndGetPayload: ({viewerId, reference, company, firstName, lastName, type, phone}) => {

    return DB.models.owner.findOne({where : {reference : reference }})
        .then(owner => owner.updateAttributes({type_id: type}) )
        .then((owner)  => {

          DB.models.owner_company_name.findOne({where: {owner_id: owner.id}})
              .then(owner_company_name => owner_company_name.updateAttributes({name: company}))

          if(firstName || lastName) {
            DB.models.owner_contact.findOne({where: {owner_id: owner.id}})
                .then(owner_contact => {

                  if (owner_contact) {
                    DB.models.contact.findOne({where: {id: owner_contact.contact_id}})
                        .then(contact => {

                          contact.updateAttributes({first_name: firstName, last_name: lastName})

                          if (contact.getContactInfo()) { contact.getContactInfo().then(contactInfo => contactInfo[0].updateAttributes({phone: phone})) }
                          else { if (phone) contact.createContactInfo({phone: phone}) }
                        })
                  }
                  else {
                    owner.createContact({first_name: firstName, last_name: lastName})
                        .then(contact => { if (phone) contact.createContactInfo({phone: phone}) })
                  }
                })
          }

      return {
        viewerId: viewerId,
        owner: owner
      };
    });

  },
});

var AddPropertyMutation = exports.AddPropertyMutation = mutationWithClientMutationId({
  name: 'AddProperty',
  inputFields: {
    viewerId: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    reference: { type: new GraphQLNonNull(GraphQLString) },
    propertyType: { type: new GraphQLNonNull(GraphQLInt) },
    contractType: { type: new GraphQLNonNull(GraphQLInt) },
    description: { type: GraphQLString },
    price: { type: GraphQLInt },
    floorCount: { type: GraphQLInt },
    roomCount: { type: GraphQLInt },
    size: { type: GraphQLFloat },
    district: { type: GraphQLString},
    city: { type: GraphQLString },
    ownerRef: { type: new GraphQLNonNull(GraphQLString) },
    mediaNames: { type: new GraphQLList(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({viewerId}) => DB.models.user.findOne({where: {id: viewerId}}),
    }
  },
  mutateAndGetPayload: ({viewerId, name, reference, propertyType, contractType, description, ownerRef, mediaNames, price, floorCount, roomCount, size, district, city}) => {

    var sanitizedMediaNames = _.map(mediaNames, name => {
      return sanitize(name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, '') )
    });


    return DB.models.owner.findOne({where: {reference: ownerRef}})
        .then((owner) =>
            owner.createProperty({
                  name: name,
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

          if(district && city) {
            property.createPropertyLocation({
              property_id: property.id,
              district: district,
              city: city
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


var EditPropertyMutation = exports.EditPropertyMutation = mutationWithClientMutationId({
  name: 'EditProperty',
  inputFields: {
    viewerId: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    reference: { type: new GraphQLNonNull(GraphQLString) },
    propertyType: { type: new GraphQLNonNull(GraphQLInt) },
    contractType: { type: new GraphQLNonNull(GraphQLInt) },
    description: { type: GraphQLString },
    price: { type: GraphQLInt },
    floorCount: { type: GraphQLInt },
    roomCount: { type: GraphQLInt },
    size: { type: GraphQLFloat },
    district: { type: GraphQLString},
    city: { type: GraphQLString },
    ownerRef: { type: new GraphQLNonNull(GraphQLString) },
    mediaNames: { type: new GraphQLList(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({viewerId}) => DB.models.user.findOne({where: {id: viewerId}}),
    }
  },
  mutateAndGetPayload: ({viewerId, name, reference, propertyType, contractType, description, mediaNames, price, floorCount, roomCount, size, district, city}) => {


    var sanitizedMediaNames = _.map(mediaNames, name => {
      return sanitize(name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, '') )
    });

    return DB.models.property.findOne({where: {reference: reference}})
        .then((property) =>
            property.updateAttributes({
                  name: name,
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
                  if(property_size) property_size.updateAttributes({size: size})
                  else property.createPropertySize({
                    property_id: property.id,
                    size: size
                  });
                });


          if(district) {

            DB.models.property_location.findOne({where: {property_id: property.id}})
                .then(property_location => {
                  if (property_location) property_location.updateAttributes({district: district, city: city})
                  else property.createPropertyLocation({
                    property_id: property.id,
                    district: district,
                    city: city
                  });
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

const AttachMediaMutation = mutationWithClientMutationId({
  name: 'AttachMedia',
  inputFields: {
    viewerId: { type: new GraphQLNonNull(GraphQLInt) },
    uri: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {

    user: {
      type: userType,
      resolve: ({viewerId}) => DB.models.user.findOne({where: {id: viewerId}}),
    }
  },
  mutateAndGetPayload: (input, options) => {

    const filename = sanitize(input.name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''));
    const mimeType = input.name.substring(input.name.lastIndexOf('.')+1);


    return DB.models.media.create({
          name: filename,
          uri: '/images/' + filename,
          mime_type: mimeType
        })
        .then((media) => {
          return  {
            viewerId: input.viewerId,
            media: media
          }
        })

  },
});

var DeletePropertyMutation = exports.DeletePropertyMutation = mutationWithClientMutationId({
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
    user: {
      type: userType,
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

var AddAppMessageMutation = exports.AddAppMessageMutation = mutationWithClientMutationId({
  name: 'AddAppMessage',
  inputFields: {
    viewerId: { type: new GraphQLNonNull(GraphQLInt) },
    text: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({viewerId}) => DB.models.user.findOne({where: {id: viewerId}}),
    }
  },
  mutateAndGetPayload: ({viewerId, text}) => {

    var appMessage = {
      id: 0,
      text: text
    };

    AppMessage = appMessage;

    return {
      viewerId: viewerId
    };
  }
});

var AddUserMutation = exports.AddUserMutation  = mutationWithClientMutationId({
  name: 'AddUser',
  description: 'Function to add a user',
  inputFields: {
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    login: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)},
    phone: {type: new GraphQLNonNull(GraphQLString)},
    enabled: {type: GraphQLBoolean}
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (obj) => {
        console.log("In AddUserMutation output field viewer : " + JSON.stringify(obj));
        return {}
      }
    }
  },
  mutateAndGetPayload: (input) => {

    delete input.clientMutationId;
    console.log("input : " + JSON.stringify(input));

    return DB.models.user.create(input)
        .then(r => {
          console.log("response from create user : " + JSON.stringify(r));
          return Database.models.user.findOne({where: {login: input.login}})
        })
  }
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addOwnerMutation: AddOwnerMutation,
    editOwnerMutation: EditOwnerMutation,
    addPropertyMutation: AddPropertyMutation,
    addAppMessageMutation: AddAppMessageMutation,
    attachPropertyMediaMutation: AttachMediaMutation,
    editPropertyMutation: EditPropertyMutation,
    deletePropertyMutation: DeletePropertyMutation,
    addUserMutation: AddUserMutation
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  mutation: mutationType
});
