import React from 'react';
import Relay from 'react-relay';
import Property from './PropertyNew'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Properties extends React.Component {

    render() {

        let city = this.props.relay.variables.city? this.props.relay.variables.city.toUpperCase() : '';

        var properties = <div className="row">
                <div className="page-header col-xs-10 col-sm-10 col-md-6 center-block text-center opacity-54">
                    <h1>Aucune propriété publiée pour le moment. Revenez bientôt!</h1>
                </div>
            </div>;

        if(this.props.customer.properties.edges.length > 0) {

            properties = this.props.customer.properties.edges.map(function (edge) {
                return <Property key={edge.node.id} property={edge.node}/>

            });

        }

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    {city?
                        <div className="page-header">
                            <h3>{city}</h3>
                        </div>
                        : ''
                    }
                    <div className="row">{properties}</div>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default Relay.createContainer(Properties, {

    initialVariables: {reference: "", city :""},

    fragments: {
        customer: () => Relay.QL`
          fragment on Viewer {
            properties(reference: $reference, city: $city, first: 100) {
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
                  location
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