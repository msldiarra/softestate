import Relay from 'react-relay';
import _ from 'lodash'


export default class AttachMediaMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation {attachPropertyMediaMutation}`;
    }

    getFiles() {
        return {
            file: this.props.file,
        };
    }

    getVariables() {
        return {
            viewerId: this.props.viewerId,
            name: this.props.name,
            uri: this.props.uri
        };
    }

    getFatQuery() {
        return Relay.QL`
          fragment on AttachMediaPayload {
              user
          }
    `;
    }

    getConfigs() {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    user: this.props.viewer.id
                }
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
                id: this.props.viewer.id
            }
        };
    }
}
