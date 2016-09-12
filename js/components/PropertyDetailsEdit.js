import React from 'react'
import Relay from 'react-relay'
import EditPropertyMutation from './EditPropertyMutation'
import AddAppMessageMutation from './AddAppMessageMutation'
import AppMessage from './AppMessage';
import SearchComponent from './SearchComponent';
import AttachMedia from './AttachMedia';
import UserService from './AuthService'
import ReactDOM from 'react-dom'
import AttachMediaMutation from './AttachMediaMutation'
import {EditorState, ContentState} from 'draft-js';
import RichEditor from './RichEditor';


class PropertyDetailsEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {propertyType : 0,  contractType : 0, ownerRef: '', message : "", mediaNames: [], editorState: EditorState.createEmpty()} ;
    }


    onEditDescription(editorState){

        this.setState({editorState});
    }

    onEditProperty(e) {

        e.preventDefault();

        var name = this.refs.name.value;
        var reference =  this.refs.reference.value;
        var propertyType =  this.state.propertyType;
        var contractType =  this.state.contractType;
        var description =  this.state.editorState.getCurrentContent().getPlainText();
        var size = this.refs.size.value;
        var floorCount = this.refs.floorCount.value;
        var roomCount = this.refs.roomCount.value;
        var price = this.refs.price.value;
        var district = this.refs.district.value;
        var city = this.refs.city.value;
        var owner = this.state.ownerRef;
        var mediaNames = this.state.mediaNames;


        var editPropertyMutation = new EditPropertyMutation({
            viewer: this.props.viewer,
            viewerId: UserService.getUserId(),
            name: name,
            reference: reference,
            propertyType: propertyType,
            contractType: contractType,
            description: description,
            size: size,
            floorCount: floorCount,
            roomCount: roomCount,
            price: price,
            ownerRef: owner,
            district: district,
            city: city,
            mediaNames: mediaNames
        });

        var onSuccess = () => this.context.router.push('/property/' + reference);

        var onFailure = (transaction) => this.setState({message : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
        " Contactez l'administrateur"});

        Relay.Store.commitUpdate(editPropertyMutation, {onSuccess, onFailure})

    }

    onMediaInsert(file, uri) {

        var onSuccess = (response) => this.setState({message: "Nouvelle image ajoutée avec succes!"});
        var onFailure = (transaction) => this.setState({message: transaction});

        Relay.Store.commitUpdate(
            new AttachMediaMutation({
                viewer: this.props.viewer,
                viewerId: UserService.getUserId(),
                uri: uri,
                name: file.name,
                file: file
            }, {onSuccess, onFailure})
        );
    }

    onAddMedia(mediaName) {
        var names = this.state.mediaNames;
        names.push(mediaName);
        this.setState({mediaNames: names});
    }

    handlePropertyType(e) {
        this.setState({ propertyType : e.target.value });
    }

    handleContractType(e) {
        this.setState({ contractType : e.target.value });
    }

    onOwnerEnter(reference) {
        this.setState({ownerRef: reference});
    }

    componentDidMount() {

        var property = this.props.viewer.properties.edges[0].node;

        this.setState({ propertyType : property.type_id });

        this.setState({ contractType : property.contract_type });

    }

    render() {

        var property = this.props.viewer.properties.edges[0].node;

        const text = this.state.message;

        return (
            <div className="">
                <div className="page-header col-md-6 center-block row">
                    <h3>
                        <span className="col-md-12"><i className="fa fa-home" aria-hidden="true" /> Propriété ref: {property.reference} </span>
                    </h3>
                </div>

                {text? <AppMessage message={text} /> : ''}

                <form className="form-horizontal padding-20" name="edit-property" >
                    <div className="page-content row">
                        <div className="col-md-6 center-block">
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Propriétaire</label>
                                <div className="col-md-12">
                                    <SearchComponent userID={UserService.getUserId()}
                                                     search="" placeHolder="Entrer le nom du Propriétaire"
                                                     onOwnerEnter={this.onOwnerEnter.bind(this)}
                                                     defaultValue={property.owner.reference}
                                        {...this.props} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Nom de la propriété</label>
                                <div className="col-md-12">
                                    <input ref="name" id="name"  type="text" className="form-control"  defaultValue={property.name}
                                           placeholder="Saisissez un nom pour la propriété" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Reference</label>
                                <div className="col-md-12">
                                    <input ref="reference" id="reference" type="text" className="form-control" defaultValue={property.reference}
                                           placeholder="Saisissez une référence plus technique" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Quartier</label>
                                <div className="col-md-12">
                                    <input ref="district" id="district" defaultValue={property.district}  type="text" className="form-control" placeholder="Saisissez le quartier ou se trouve le bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Ville</label>
                                <div className="col-md-12">
                                    <input ref="city" id="city" type="text" defaultValue={property.city} className="form-control" placeholder="Saisissez la ville ou se trouve le bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="type" className="col-md-12">Type de bien</label>
                                <div className="col-md-12">
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="apartment" value="1" name="propertyType" onChange={this.handlePropertyType.bind(this)}
                                        checked={this.state.propertyType == 1? true : false} /> Appartement
                                    </label>
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="house" value="2" name="propertyType" onChange={this.handlePropertyType.bind(this)}
                                               checked={this.state.propertyType == 2? true : false}/> Villa
                                    </label>
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="land" value="3" name="propertyType" onChange={this.handlePropertyType.bind(this)}
                                               checked={this.state.propertyType == 3? true : false}/> Terrain
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="type" className="col-md-12">Type de contrat</label>
                                <div className="col-md-12">
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="rent" value="1" name="contractType" onChange={this.handleContractType.bind(this)}
                                               checked={this.state.contractType == 1? true : false} /> Location
                                    </label>
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="sell" value="2" name="contractType" onChange={this.handleContractType.bind(this)}
                                               checked={this.state.contractType == 2? true : false} /> Vente
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Ajouter une image</label>
                                <div className="col-md-12">
                                    <AttachMedia viewer={this.props.viewer} onAddMedia={this.onAddMedia.bind(this)} onMediaInsert={this.onMediaInsert.bind(this)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Prix</label>
                                <div className="col-md-12">
                                    <input type="text" ref="price" id="price" defaultValue={property.price} className="form-control" placeholder="Mensualité ou prix de vente" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Nombre de niveau</label>
                                <div className="col-md-12">
                                    <input type="text" ref="floorCount" id="floorCount" defaultValue={property.floor_count} className="form-control" placeholder="Si appartement ou villa indiquez le nombre d'étages" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Nombre de chambres</label>
                                <div className="col-md-12">
                                    <input type="text" ref="roomCount" id="roomCount" defaultValue={property.room_count} className="form-control" placeholder="Nombre total de chambre(s) du bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Superficie totale</label>
                                <div className="col-md-12">
                                    <input type="text" ref="size" id="size" defaultValue={property.size} className="form-control" placeholder="Superficie totale du bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Description</label>
                                <div className="col-md-12">
                                    <RichEditor onChange={this.onEditDescription.bind(this)} propertyDescription={property.description}
                                                placeholder="Décrivez le bien de manière à le mettre en valeur" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-3">&nbsp;</div>
                                <div className="col-md-12">
                                    <inupt type="s" className="btn btn-primary" onClick={this.onEditProperty.bind(this)}>Enregistrer les modifications</inupt>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );

    }
}

PropertyDetailsEdit.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(PropertyDetailsEdit, {

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
                      type_id
                      contract_type
                      district
                      city
                      size
                      floor_count
                      room_count
                      price
                      description
                      owner {
                        reference
                      }
                      media(first: 10) {
                        edges {
                            node {
                                uri
                            }
                        }
                      }
                    }
                  },
                },
                ${EditPropertyMutation.getFragment('viewer')}
                ${SearchComponent.getFragment('viewer')}
                ${AttachMediaMutation.getFragment('viewer')}
          }
    `,
    },
});
