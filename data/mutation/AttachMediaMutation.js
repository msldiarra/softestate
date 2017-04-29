import {  GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import {  mutationWithClientMutationId } from 'graphql-relay';
import { DB } from '../database';
import {userType} from '../type/Types'
import sanitize from 'sanitize-filename';

export default mutationWithClientMutationId({
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
