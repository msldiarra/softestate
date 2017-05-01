import React from 'react'
import Relay from 'react-relay'
import AddPropertyMutation from './AddPropertyMutation'
import AttachMediaMutation from './AttachMediaMutation'
import AppMessage from './AppMessage';
import SearchComponent from './SearchComponent';
import AttachMedia from './AttachMedia';
import UserService from './AuthService'
import {EditorState} from 'draft-js';
import RichEditor from './RichEditor';
import ReactDOM from 'react-dom';
import Chance from 'chance';



class NewProperty extends React.Component {

    constructor(props) {
        super(props);
        this.state = {propertyType : 0,  contractType : 0, ownerRef: '', message : "", mediaNames: [], editorState: EditorState.createEmpty()} ;
    }

    onEditDescription(editorState){

        this.setState({editorState});
    }

    onAddProperty(e) {

        e.preventDefault();

        var name = this.refs.name.value;
        var reference =  new Chance().word({length: 12});
        var propertyType =  this.state.propertyType;
        var contractType =  this.state.contractType;
        var description =  this.state.editorState.getCurrentContent().getPlainText();
        var size = this.refs.size.value;
        var floorCount = this.refs.floorCount.value;
        var roomCount = this.refs.roomCount.value;
        var district = this.refs.district.value;
        var city = this.refs.city.value;
        var price = this.refs.price.value;
        var owner = this.state.ownerRef;
        var mediaNames = this.state.mediaNames;


        var addPropertyMutation = new AddPropertyMutation({
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
            district: district,
            city: city,
            ownerRef: owner,
            mediaNames: mediaNames
        });

        var onSuccess = () => this.context.router.push('/property/' + reference);

        var onFailure = (transaction) => this.setState({message : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
        " Contactez l'administrateur"});

        Relay.Store.commitUpdate(addPropertyMutation, {onSuccess, onFailure})

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

    onAddMedia(mediaNames) {
        var names = this.state.mediaNames;
        names.push(mediaNames);
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

    render() {

        const text = this.state.message;
        return (
            <div className="">
                <div className="page-header col-md-6 center-block row">
                    <h3>
                        <span className="col-md-12"><i className="fa fa-home" aria-hidden="true" /> Nouveau bien</span>
                    </h3>
                </div>

                {text? <AppMessage message={text} /> : ''}

                <form className="form-horizontal padding-20" name="add-property">
                    <div className="page-content row">
                        <div className="col-md-6 center-block">
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Propriétaire</label>
                                <div className="col-md-12">
                                    <SearchComponent viewerId={UserService.getUserId()}
                                                     search="" placeHolder="Entrer le nom du Propriétaire"
                                                     onOwnerEnter={this.onOwnerEnter.bind(this)}
                                                     defaultValue=""
                                        {...this.props} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Titre pour la propriété</label>
                                <div className="col-md-12">
                                    <input type="text" ref="name" id="name"  className="form-control" placeholder="Saisissez un titre pour la propriété" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Quartier</label>
                                <div className="col-md-12">
                                    <input ref="district" id="district" type="text" className="form-control" placeholder="Saisissez le quartier ou se trouve le bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Ville</label>
                                <div className="col-md-12">
                                    <input ref="city" id="city" type="text" className="form-control" placeholder="Saisissez la ville ou se trouve le bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="type" className="col-md-12">Type de bien</label>
                                <div className="col-md-12">
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="apartment" value="1" name="propertyType" onClick={this.handlePropertyType.bind(this)} /> Appartement
                                    </label>
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="house" value="2" name="propertyType" onClick={this.handlePropertyType.bind(this)} /> Villa
                                    </label>
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="land" value="3" name="propertyType" onClick={this.handlePropertyType.bind(this)} /> Terrain
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="type" className="col-md-12">Type de contrat</label>
                                <div className="col-md-12">
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="rent" value="1" name="contractType" onClick={this.handleContractType.bind(this)} /> Location
                                    </label>
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="sell" value="2" name="contractType" onClick={this.handleContractType.bind(this)} /> Vente
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
                                    <input type="text" ref="price" id="price" className="form-control" placeholder="Mensualité ou prix de vente" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Nombre de niveau</label>
                                <div className="col-md-12">
                                    <input type="text" ref="floorCount" id="floorCount" className="form-control" placeholder="Si appartement ou villa indiquez le nombre d'étages" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Nombre de chambres</label>
                                <div className="col-md-12">
                                    <input type="text" ref="roomCount" id="roomCount" className="form-control" placeholder="Nombre total de chambre(s) du bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Superficie totale</label>
                                <div className="col-md-12">
                                    <input type="text" ref="size" id="size" className="form-control" placeholder="Superficie totale du bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Description</label>
                                <div className="col-md-12">
                                    <RichEditor onEditDescription={this.onEditDescription.bind(this)} proprtyDescription=""
                                                placeholder="Décrivez le bien de manière à le mettre en valeur" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-3">&nbsp;</div>
                                <div className="col-md-12">
                                    <inupt type="s" className="btn btn-primary" onClick={this.onAddProperty.bind(this)}>Enregistrer la nouvelle propriétée</inupt>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );

    }
}


NewProperty.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(NewProperty, {

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
               id,
               ${AddPropertyMutation.getFragment('viewer')}
               ${SearchComponent.getFragment('viewer')}
               ${AttachMediaMutation.getFragment('viewer')}
          }
    `,
    }
});
