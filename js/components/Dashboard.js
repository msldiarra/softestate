import React from 'react';
import Relay from 'react-relay';
import AuthenticatedComponent from './AuthenticatedComponent';
import Properties  from './Properties'

class Dashboard extends React.Component {

    render() {
        return (
            <div className="">
                <div className="page-header row">
                    <h4>
                        <span className="col-xs-10"><i className="fa fa-users" aria-hidden="true"></i> Clients</span>
                    </h4>
                </div>
                <Properties customer={this.props.viewer} />
            </div>
        );
    }
}

export default Relay.createContainer(Dashboard, {

    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
               id
               ${Properties.getFragment('customer')}
          }
    `,
    }

});