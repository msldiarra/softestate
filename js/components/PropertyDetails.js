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
        this.state = { message : "" } ;
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

        var property = this.props.viewer.properties && this.props.viewer.properties.edges.length > 0? this.props.viewer.properties.edges[0].node : null;

        if(property == null)
            this.context.router.replace('/');

    }

    render() {

        const canEdit = UserService.getUser() != null;

        const text = this.state.message;

        var propertyDisplay = '';
        var property = this.props.viewer.properties && this.props.viewer.properties.edges.length > 0? this.props.viewer.properties.edges[0].node : null;

        if(property)
            propertyDisplay = (
                <div className="row padding-25">
                    <div className="col-md-8">
                        {property.media ? <Images media={property.media} />: <div></div> }
                    </div>
                    <div className="col-md-4">

                            <h2 className="row">
                                <div className="col-md-6 col-xs-6 col-sm-6">{property.name}</div>
                                {canEdit?
                                <div className="pull-right padding-right-15">
                                    <a href={'/#/admin/property/' + property.reference + '/edit'}>
                                        <div className="circle text-center"><i className="fa fa-pencil" aria-hidden="true" /></div>
                                    </a>
                                    &nbsp;
                                    <a href="#" onClick={this.deleteProperty.bind(this)}>
                                        <div className="circle text-center"><i className="fa fa-trash" aria-hidden="true" /></div>
                                    </a>
                                </div>
                                    :
                                    '' }
                            </h2>
                            {property.price?
                                <h4>A partir de {property.price} FCFA  {property.contract_type==1? ' / mois' : ''} </h4>
                                :
                             ''}
                            <br/>
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
          fragment on User {
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
                ${DeletePropertyMutation.getFragment('viewer')}
          }
    `,
    },
});

