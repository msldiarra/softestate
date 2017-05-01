import React from 'react';
import Relay from 'react-relay';
import AuthenticatedComponent from './AuthenticatedComponent';
import Properties  from './Properties'

class Dashboard extends React.Component {

    render() {
        return (
            <div className="">
                <div className="page-header row">

                </div>
                <Properties customer={this.props.viewer} />
                <br/>
                <footer className="text-center">&copy;2017 UL- L'Usine Logicielle</footer>
                <br/>
            </div>
        );
    }
}

export default Relay.createContainer(Dashboard, {

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
               id
               ${Properties.getFragment('customer')}
          }
    `,
    }

});