import {  GraphQLInt,  GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {  mutationWithClientMutationId } from 'graphql-relay';
import { DB } from '../database';
import {viewerType} from '../type/Types'
import {getViewer} from '../store/UserStore';



export default mutationWithClientMutationId({
    name: 'EditOwner',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        reference: { type: new GraphQLNonNull(GraphQLString) },
        company: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLInt) }
    },
    outputFields: {
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => getViewer(viewerId)
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

                                        if (contact.getContactInfos()) { contact.getContactInfos().then(contactInfo => contactInfo[0].updateAttributes({phone: phone})) }
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
