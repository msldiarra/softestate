import React from 'react';
import Relay from 'react-relay';
import AuthenticatedComponent from './AuthenticatedComponent';
import Properties  from './Properties'
import Header from './Header';
import AuthService from './AuthService';

class Dashboard extends React.Component {

    logout(e) {
        e.preventDefault();
        AuthService.logout();
        this.context.router.replace('admin/login')
    }

    render() {
        return (
            <div className="">
                <div className="page-header row">

                </div>
                <Properties customer={this.props.viewer} />
                <br/>
                <footer className="text-center">&copy;2016 AIA-Mali SARL. Site réalisé par UL- L'Usine Logicielle SARL</footer>
                <br/>
            </div>

        );
    }
}

export default Relay.createContainer(Dashboard, {

    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
               ${Properties.getFragment('customer')}
          }
    `,
    }

});