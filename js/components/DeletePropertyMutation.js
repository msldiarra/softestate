import Relay from 'react-relay';

export default class DeletePropertyMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation {deletePropertyMutation}`;
    }

    getVariables() {
        return {
            viewerId: this.props.viewerId,
            propertyId: this.props.propertyId,
            propertyReference: this.props.propertyReference,
        };
    }

    getFatQuery() {
        return Relay.QL`
          fragment on DeletePropertyPayload {
              deletedPropertyID
              user {
                properties
              }

          }
    `;
    }

    getConfigs() {
        return [
            {
                type: 'RANGE_DELETE',
                parentName: 'user',
                parentID: this.props.viewer.id,
                connectionName: 'properties',
                deletedIDFieldName: 'deletedPropertyID',
                pathToConnection: ['user', 'properties']
            }
        ]
    }

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
                properties : []
            }
        };
    }
}
