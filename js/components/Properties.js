import React from 'react';
import Relay from 'react-relay';
import Property from './PropertyNew'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Properties extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading :  false} ;
        this.onScroll = this.onScroll.bind(this)

    }

    onScroll() {
        window.onscroll = () => {

            if(!this.state.loading && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                this.setState({loading: true}, () => {
                    this.props.relay.setVariables({count: this.props.relay.variables.count + 5},
                    (readyState) => {
                        if (readyState.done) {
                            this.setState({loading: false})
                        }
                    })
                })
            }
        }
    }

    componentDidMount() {
        this.onScroll();
    }

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
                    {this.state.loading &&
                        <div className="text-center"><i className="fa fa-2x fa-spinner" /></div>
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default Relay.createContainer(Properties, {

    initialVariables: {reference: "", city :"", count: 15 },

    fragments: {
        customer: () => Relay.QL`
          fragment on Viewer {
            properties(reference: $reference, city: $city, first: $count) {
              edges {
                node {
                  id
                  reference
                  name
                  date
                  type_label
                  type_id
                  contract_type
                  size
                  size_unit
                  floor_count
                  room_count
                  price
                  description
                  location
                  city
                  neighborhood
                  agency
                  contact_phone
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