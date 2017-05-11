import React from 'react';
import Relay from 'react-relay';
import Property from './PropertyNew'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Properties extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading :  false, contractType : 1} ;
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

    changeContractType(value) {
        this.setState({contractType: value},
            () => {this.props.relay.setVariables({contractType: value})});
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
            <div>
                <div className="" style={{height:'60px', lineHeight:'60px', verticalAlign:'middle'}}>
                    {city?
                        <div className="col-xs-4"><span className="font-passion-one">{city}</span></div>
                        : ''
                    }
                    <div className="form-group col-xs-8 pull-right" >
                        <div className="btn-group btn-group-justified-custom" role="group" >
                            <div className="btn-group" role="group">
                                <button onClick={this.changeContractType.bind(this, 1)} type="button" className={"btn btn-default " + (this.state.contractType ==  1? "active" : "")} value="1">Location</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button onClick={this.changeContractType.bind(this, 2)} type="button" className={"btn btn-default " + (this.state.contractType ==  2? "active" : "")} value="2">Vente</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">{properties}</div>
                {this.state.loading &&
                    <div className="text-center"><i className="fa fa-2x fa-spinner" /></div>
                }
            </div>
        );
    }
}

export default Relay.createContainer(Properties, {

    initialVariables: {reference: "", city :"", contractType: 1, count: 15 },

    fragments: {
        customer: () => Relay.QL`
          fragment on Viewer {
            properties(reference: $reference, city: $city, contract_type: $contractType, first: $count) {
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