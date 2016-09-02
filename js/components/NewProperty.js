import React from 'react'
import Relay from 'react-relay'
import AddPropertyMutation from './AddPropertyMutation'
import AddAppMessageMutation from './AddAppMessageMutation'
import AttachMediaMutation from './AttachMediaMutation'
import AppMessage from './AppMessage';
import SearchComponent from './SearchComponent';
import AttachMedia from './AttachMedia';
import UserService from './AuthService'
import ReactDOM from 'react-dom'


class NewProperty extends React.Component {

    constructor(props) {
        super(props);
        this.state = {propertyType : 0,  contractType : 0, ownerRef: '', message : "", mediaName: ''} ;
    }

    onAddProperty(e) {

        e.preventDefault();

        var name = this.refs.name.value;
        var reference =  this.refs.reference.value;
        var propertyType =  this.state.propertyType;
        var contractType =  this.state.contractType;
        var description =  this.refs.description.value;
        var owner = this.state.ownerRef;
        var mediaName = this.state.mediaName;


        var addPropertyMutation = new AddPropertyMutation({
            viewer: this.props.viewer,
            viewerId: UserService.getUserId(),
            name: name,
            reference: reference,
            propertyType: propertyType,
            contractType: contractType,
            description: description,
            ownerRef: owner,
            mediaName: mediaName
        });

        var onSuccess = (response) => this.setState({message : "Nouvelle propriété ajoutée avec succes!"});

        var onFailure = (transaction) => this.setState({message : "Désolé"});

        Relay.Store.commitUpdate(addPropertyMutation, {onSuccess, onFailure})

        /*
        var addAppMessageMutation = new AddAppMessageMutation({
            viewer: this.props.viewer,
            viewerId: UserService.getUserId(),
            text: "Well done!"
        });

        Relay.Store.commitUpdate(addAppMessageMutation, {onSuccess, onFailure})
        */

    }

    onAddMedia(mediaName) {
        this.setState({mediaName: mediaName});
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
                <div className="page-header row">
                    <h4>
                        <span className="col-xs-10"><i className="fa fa-user" aria-hidden="true" /> Nouvelle propriété</span>
                    </h4>
                </div>

                <AppMessage message={text} />

                <form className="form-horizontal padding-20" name="addOwner" >
                    <div className="page-content row">
                        <div className="col-md-6 col-md-offset-1">
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-3 control-label">Propriétaire</label>
                                <div className="col-md-9">
                                    <SearchComponent userID={UserService.getUserId()}
                                                     search="" placeHolder="Entrer le nom du Propriétaire"
                                                     onOwnerEnter={this.onOwnerEnter.bind(this)}
                                                     defaultValue=""
                                        {...this.props} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-3 control-label">Nom de la propriété</label>
                                <div className="col-md-9">
                                    <input ref="name" id="name"  type="text" className="form-control" placeholder="Saisissez un nom pour la propriété" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-3 control-label">Reference</label>
                                <div className="col-md-9">
                                    <input ref="reference" id="reference" type="text" className="form-control" placeholder="Saisissez une référence plus technique" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="type" className="col-md-3 control-label">Type de bien</label>
                                <div className="col-md-9">
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
                                <label htmlFor="type" className="col-md-3 control-label">Type de contrat</label>
                                <div className="col-md-9">
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="rent" value="1" name="contractType" onClick={this.handleContractType.bind(this)} /> Location
                                    </label>
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="sell" value="2" name="contractType" onClick={this.handleContractType.bind(this)} /> Vente
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-3 control-label">Description</label>
                                <div className="col-md-9">
                                    <textarea ref="description" id="description" className="form-control" placeholder="Décrivez la propriété en quelques mots." />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-3 control-label">Ajouter une image</label>
                                <div className="col-md-9">
                                    <AttachMedia viewer={this.props.viewer} onAddMedia={this.onAddMedia.bind(this)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-3">&nbsp;</div>
                                <div className="col-md-9">
                                    <inupt type="s" className="btn btn-default" onClick={this.onAddProperty.bind(this)}>Enregistrer la nouvelle propriétée</inupt>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );

    }
}


export default Relay.createContainer(NewProperty, {

    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
               id,
               ${AddPropertyMutation.getFragment('viewer')}
               ${SearchComponent.getFragment('viewer')}
               ${AttachMediaMutation.getFragment('viewer')}
          }
    `,
    }
});
