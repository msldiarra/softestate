import Relay from 'react-relay';
import _ from 'lodash'


export default class EditPropertyMutation extends Relay.Mutation {
    // This method should return a GraphQL operation that represents
    // the mutation to be performed. This presumes that the server
    // implements a mutation type named ‘likeStory’.
    getMutation() {
        return Relay.QL`mutation {editPropertyMutation}`;
    }
    // Use this method to prepare the variables that will be used as
    // input to the mutation. Our ‘likeStory’ mutation takes exactly
    // one variable as input – the ID of the story to like.
    getVariables() {
        return {
            viewerId: this.props.viewerId,
            name: this.props.name,
            reference: this.props.reference,
            propertyType: this.props.propertyType,
            contractType: this.props.contractType,
            description: this.props.description,
            size: this.props.size,
            floorCount: this.props.floorCount,
            roomCount: this.props.roomCount,
            price: this.props.price,
            district: this.props.district,
            city: this.props.city,
            ownerRef: this.props.ownerRef,
            mediaNames: this.props.mediaNames
        };
    }
    // Use this method to design a ‘fat query’ – one that represents every
    // field in your data model that could change as a result of this mutation.
    // Liking a story could affect the likers count, the sentence that
    // summarizes who has liked a story, and the fact that the viewer likes the
    // story or not. Relay will intersect this query with a ‘tracked query’
    // that represents the data that your application actually uses, and
    // instruct the server to include only those fields in its response.
    getFatQuery() {
        return Relay.QL`
          fragment on EditPropertyPayload {
              user
          }
    `;
    }
    // These configurations advise Relay on how to handle the LikeStoryPayload
    // returned by the server. Here, we tell Relay to use the payload to
    // change the fields of a record it already has in the store. The
    // key-value pairs of ‘fieldIDs’ associate field names in the payload
    // with the ID of the record that we want updated.
    getConfigs() {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    user: this.props.viewer.id
                }
            }/*,
            {
                type: 'RANGE_ADD',
                parentName: 'viewer',
                parentID: this.props.viewer.id,
                connectionName: 'owners',
                edgeName: 'ownerEdge',
                rangeBehaviors: {
                    '': 'append',
                    // Prepend the ship, wherever the connection is sorted by age
                    'first(100)': 'prepend'
                }
            }*/
        ]
    }
    // This mutation has a hard dependency on the story's ID. We specify this
    // dependency declaratively here as a GraphQL query fragment. Relay will
    // use this fragment to ensure that the story's ID is available wherever
    // this mutation is used.
    static fragments = {
        viewer: () => Relay.QL`
          fragment on User {
            id
          }
    `,
    };

    getOptimisticResponse() {

        return {
            viewer: {
                id: this.props.viewer.id,
            }
        };
    }
}

