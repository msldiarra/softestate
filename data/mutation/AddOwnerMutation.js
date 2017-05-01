import {  GraphQLInt,  GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {  mutationWithClientMutationId } from 'graphql-relay';
import { DB } from '../database';
import {viewerType} from '../type/Types'


export default mutationWithClientMutationId({
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
        viewer: {
            type: viewerType,
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
