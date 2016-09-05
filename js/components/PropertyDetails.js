import React from 'react';
import Relay from 'react-relay';
import Images from './Images'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export default class PropertyDetails extends React.Component {

    componentDidMount() {

        var property = this.props.viewer.properties.edges.length > 0? this.props.viewer.properties.edges[0].node : null;

        if(property == null)
            this.context.router.replace('/');

    }

    render() {

        var propertyDisplay = '';
        var property = this.props.viewer.properties.edges.length > 0? this.props.viewer.properties.edges[0].node : null;

        if(property)
            propertyDisplay = (
                <div className="row padding-25">
                    <div className="col-md-8">
                        <Images media={property.media} />
                    </div>
                    <div className="col-md-4">
                        <h2>{property.name}</h2>
                        <h4>A partir de {property.price}  {property.contract_type==1? 'FCFA / mois' : ''} </h4><br/>
                        <dl>
                            <dt></dt>
                            <dd>
                                {property.size? <div><label>Superficie:</label> {property.size} m²</div> : ''}
                                {property.room_count ? <div><label>Nombre de chambres:</label> {property.room_count}</div>:''}
                                {property.floor_count ? <div><label>Nombre de niveau :</label> {property.floor_count}</div> : ''}
                                {property.district ?<div>{property.district}, {property.city}</div> : ''}
                            </dd>
                        </dl>
                        <h3>Description</h3>
                        {property.description ? <p style={{paddingRight: '15px'}}>{property.description}</p> : <p>...</p>}

                    </div>
                </div>)

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    {propertyDisplay}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}


PropertyDetails.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(PropertyDetails, {

    initialVariables: {reference: ''},

    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
                id,
                properties(reference: $reference, first: 10) {
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
                      media(first: 10) {
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

