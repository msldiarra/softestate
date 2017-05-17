import {  GraphQLInt,  GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {  mutationWithClientMutationId } from 'graphql-relay';
import { DB } from '../database';
import {viewerType} from '../type/Types'
import {getViewer} from '../store/UserStore';


export default mutationWithClientMutationId({
    name: 'AddOwner',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        company: { type: new GraphQLNonNull(GraphQLString) },
        customer: { type: new GraphQLNonNull(GraphQLString) },
        reference: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLInt) },
    },
    outputFields: {
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => getViewer(viewerId)
        }

    },
    mutateAndGetPayload: ({viewerId, reference, company, customer, firstName, lastName, phone, type}) => {

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

            if(customer) {
                DB.models.customer.findOne({where :{name: customer}})
                    .then(customer => customer.addOwner(owner))
            }

            return {
                viewerId: viewerId,
                owner: owner
            };

        });

    },
});
