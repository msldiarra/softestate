import React from 'react';
import Relay from 'react-relay';
import Property from './Property'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Properties extends React.Component {

    render() {
        var properties = this.props.customer.properties.edges.map(function(edge){
            return <Property key={edge.node.id} property={edge.node} />

        });

        return (
            <div className="padding-25">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    <div className="row">{properties}</div>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default Relay.createContainer(Properties, {

    initialVariables: {reference: ""},

    fragments: {
        customer: () => Relay.QL`
          fragment on User {
            properties(reference: $reference, first: 100) {
              edges {
                node {
                  id
                  reference
                  name
                  type_label
                  contract_type
                  size
                  floor_count
                  room_count
                  price
                  description
                  district
                  city
                  media(first: 20) {
                    edges {
                        node {
                            id
                            uri
                        }
                    }
                  }
                }
              },
            },
          }
    `,
    },
});