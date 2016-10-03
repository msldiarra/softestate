import Relay from 'react-relay';

import {
    toGlobalId
} from 'graphql-relay'

class AddUserMutation extends Relay.Mutation {

    static fragments = {
        viewer: () => Relay.QL`
          fragment on User {
            id
          }
        `
    };

    getMutation() {
        return Relay.QL`mutation{addUserMutation}`
    }

    getFatQuery() {

        return Relay.QL`
          fragment on AddUserPayload {
             user
          }
        `
    }

    getConfigs() {

        return [
            // {
            //     type: 'FIELDS_CHANGE',
            //     fieldIDs: {
            //         viewer: "1"
            //     }
            // }
        ]
    }
    getVariables() {
        return {
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            login: this.props.login,
            password: this.props.password,
            phone: this.props.phone,
            enabled: this.props.enabled,
            customer: this.props.customer
        };
    }
}

export default AddUserMutation