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
              viewer
          }
    `;
    }

    getConfigs() {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    viewer: this.props.viewer.id
                }
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
                id: this.props.viewer.id
            }
        };
    }
}
