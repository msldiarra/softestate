import React from 'react';
import Relay from 'react-relay';
import Owner from './Owner'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Owners extends React.Component {

    render() {
        var owners = this.props.customer.owners.edges.map(function(edge){
            return <Owner key={edge.node.id} owner={edge.node} />

        });

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    {owners}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default Relay.createContainer(Owners, {
    fragments: {
        customer: () => Relay.QL`
          fragment on User {
            owners(first: 10) {
              edges {
                node {
                  id
                  reference
                  name
                  type
                  contact {
                    first_name
                    last_name
                  }
                  rentSummary {
                    apartmentCount
                    houseCount
                    landCount
                  }
                  sellSummary {
                    apartmentCount
                    houseCount
                    landCount
                  }
                }
              },
            },
          }
    `,
    },
});