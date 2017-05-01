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
              viewer {
                properties
              }

          }
    `;
    }

    getConfigs() {
        return [
            {
                type: 'RANGE_DELETE',
                parentName: 'viewer',
                parentID: this.props.viewer.id,
                connectionName: 'properties',
                deletedIDFieldName: 'deletedPropertyID',
                pathToConnection: ['viewer', 'properties']
            }
        ]
    }

    static fragments = {
        viewer: () => Relay.QL`
          fragment on Viewer {
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
