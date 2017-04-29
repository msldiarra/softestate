import {  GraphQLObjectType } from 'graphql';

import AddOwnerMutation from '../mutation/AddOwnerMutation'
import EditOwnerMutation from '../mutation/EditOwnerMutation'
import AddPropertyMutation from '../mutation/AddPropertyMutation'
import AttachMediaMutation from '../mutation/AttachMediaMutation'
import EditPropertyMutation from '../mutation/EditPropertyMutation'
import DeletePropertyMutation from '../mutation/DeletePropertyMutation'



export default new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addOwnerMutation: AddOwnerMutation,
        editOwnerMutation: EditOwnerMutation,
        addPropertyMutation: AddPropertyMutation,
        editPropertyMutation: EditPropertyMutation,
        deletePropertyMutation: DeletePropertyMutation,
        attachPropertyMediaMutation: AttachMediaMutation
    })
});