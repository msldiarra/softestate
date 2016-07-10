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

import DB from './database';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.AddOwnerMutation = undefined;

var {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {
      var {type, id} = fromGlobalId(globalId);
      if (type === 'User') { return DB.models.user.findOne({where: {id: id}}); }
      if (type === 'Contact') { return DB.models.contact.findOne({where: {id: id}}); }
      if (type === 'ContactInfo') { return DB.models.contact_info.findOne({where: {id: id}}); }
      if (type === 'Login') { return DB.models.login.findOne({where: {id: id}}); }
      if (type === 'Customer') { return DB.models.customer.findOne({where: {id: id}}); }
      if (type === 'Owner') { return DB.models.owner.findOne({where: {id: id}}); }
      if (type === 'Property') { return DB.models.property.findOne({where: {id: id}}); }
      if (type === 'OwnerType') { return DB.models.owner_type.findOne({where: {id: id}}); }
      if (type === 'SellSummary') { return DB.models.sell_summary.findOne({where: {id: id}}); }
      if (type === 'RentSummary') { return DB.models.rent_summary.findOne({where: {id: id}}); }
      else { return null; }
    },
    (obj) => {
      if (obj instanceof User) { return userType; }
      else if (obj instanceof Contact) { return contactType; }
      else if (obj instanceof Login) { return loginType; }
      else if (obj instanceof ContactInfo) { return contactInfoType; }
      else if (obj instanceof Customer) { return customerType; }
      else if (obj instanceof Owner) { return ownerType; }
      else if (obj instanceof Property) { return propertyType; }
      else if (obj instanceof OwnerType) { return ownerTypeType; }
      else if (obj instanceof SellSummary) { return sellSummaryType; }
      else if (obj instanceof RentSummary) { return rentSummaryType; }
      else { return null; }
    }
);

/**
 * Define your own types here
 */


const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A realestate agency customer',
  fields: () => {
    return {
      id: globalIdField('User'),
      customer: { type: GraphQLString, resolve(user) { return user.customer} },
      credentials: { type: loginType, resolve(user) { return DB.models.login.findOne({where: {login: user.login}}) } },
      contact: { type: contactType, resolve(user) { return DB.models.contact.findOne({where: {id: user.id}}) } },
      info: { type: contactInfoType, resolve(user) { return DB.models.contact_info.findOne({where: {email: user.email}}) } },
      owners: {
        type: ownerConnection,
        description: "A customer's collection of owners",
        args: connectionArgs,
        resolve: (_, args) => connectionFromPromisedArray(DB.models.owner.findAll(), args)
      }
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
      name: { type: GraphQLString, resolve(owner) {  return  "Name"}},
      type: { type: GraphQLString, resolve(owner) { return DB.models.owner_type.findOne({where: {id: owner.type_id}}).get('label') } },
      contact: { type: new GraphQLList(contactType), resolve(owner) { return owner.getContacts() } },
      rentSummary: {
        type: rentSummaryType,
        description: "A customer's properties to rent summary",
        resolve(owner) { return owner.getRentSummary();}
      },
      sellSummary: {
        type: sellSummaryType,
        description: "A customer's properties to sell summary",
        resolve(owner) { return owner.getSellSummary();}
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

const contactInfoType = new GraphQLObjectType({
  name: 'ContactInfo',
  fields: () => {
    return {
      id: globalIdField('ContactInfo'),
      email: { type: GraphQLString, resolve(contactInfo) { return contactInfo.email } }
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
      enabled: { type: GraphQLBoolean, resolve(property) { return property.enabled } },
      type: { type: GraphQLString, resolve(property) { return property.getType().reference } }
    }
  },
  interfaces: [nodeInterface]
});


/**
 * Define your own connection types here
 */
/*
var {connectionType: propertyConnection} =
    connectionDefinitions({name: 'Properties', nodeType: propertyType});
*/
export var {connectionType: ownerConnection} =
    connectionDefinitions({name: 'Owners', nodeType: ownerType});

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
      resolve: (root, {userID}) => DB.models.user.findOne({where: {id: userID}}),
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
    name: { type: new GraphQLNonNull(GraphQLString) },
    reference: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({userID}) => DB.models.user.findOne({where: {id: userID}}),
    }
  },
  mutateAndGetPayload: ({reference, name, type}) => {

    var owner = {
      reference: reference,
      type_id: type
    };

    return DB.models.owner.create(owner).then((owner)  => {
      // spread is necessary when multiple return value
      console.log("created event : " + JSON.stringify(owner));
      return owner;
    });

  },
});


var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addOwnerMutation: AddOwnerMutation
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
