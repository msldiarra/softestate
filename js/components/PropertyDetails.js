import React from 'react';
import Relay from 'react-relay';
import Images from './Images';
import DeletePropertyMutation from './DeletePropertyMutation';
import UserService from './AuthService'
import AppMessage from './AppMessage';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class PropertyDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = { message : "", canEdit: UserService.getUserId() != undefined? true: false} ;
    }

    deleteProperty(e) {

        e.preventDefault();

        let property = this.props.viewer.properties.edges[0].node;

        var deletePropertyMutation = new DeletePropertyMutation({
            viewer: this.props.viewer,
            viewerId: UserService.getUserId(),
            propertyId: property.id,
            propertyReference: property.reference
        });

        var onSuccess = () => this.context.router.push('/');

        var onFailure = (transaction) => this.setState({message : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
        " Contactez l'administrateur"});

        Relay.Store.commitUpdate(deletePropertyMutation, {onSuccess, onFailure})

    }

    componentDidMount() {

        var property = this.props.viewer.properties.edges.length > 0? this.props.viewer.properties.edges[0].node : null;

        if(property == null)
            this.context.router.replace('/');

    }

    render() {

        const text = this.state.message;

        var propertyDisplay = '';
        var property = this.props.viewer.properties.edges.length > 0? this.props.viewer.properties.edges[0].node : null;

        if(property)
            propertyDisplay = (
                <div className="row padding-25">
                    <div className="col-md-8">
                        <Images media={property.media} />
                    </div>
                    <div className="col-md-4">
                        <h2 className="row">
                            {this.state.canEdit?
                                <div className="pull-right padding-right-15">
                                    <a href={'/#/admin/property/' + property.reference + '/edit'}>
                                        <div className="circle text-center"><i className="fa fa-pencil" aria-hidden="true" /></div>
                                    </a>
                                    &nbsp;
                                    <a href="#" onClick={this.deleteProperty.bind(this)}>
                                        <div className="circle text-center"><i className="fa fa-trash" aria-hidden="true" /></div>
                                    </a>
                                </div>: ''}
                        </h2>
                        <h4>{property.price ? 'A partir de ' + property.price + ' ' + property.contract_type==1? ' FCFA / mois' : '' : ''} </h4><br/>
                        <dl>
                            <dt></dt>
                            <dd>
                                {property.size? <div><label>Superficie:</label> {property.size} {property.size_unit}</div> : ''}
                                {property.room_count ? <div><label>Nombre de chambres:</label> {property.room_count}</div>:''}
                                {property.floor_count ? <div><label>Nombre de niveau :</label> {property.floor_count}</div> : ''}
                                {property.neighborhood ?
                                    <div>{property.city}, {property.neighborhood}</div>
                                    :
                                    <div>{property.city}</div>
                                }
                            </dd>
                        </dl>
                    </div>
                </div>)

        return (
            <div className="">
                {text? <AppMessage message={text} /> : ''}
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    <br/>
                    <br/>
                    <br/>
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
          fragment on Viewer {
                id,
                properties(reference: $reference, first: 1) {
                  edges {
                    node {
                      id
                      reference
                      name
                      type_label
                      contract_type
                      size
                      size_unit
                      floor_count
                      room_count
                      price
                      description
                      location
                      city,
                      neighborhood
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
                ${DeletePropertyMutation.getFragment('viewer')}
          }
    `,
    },
});

