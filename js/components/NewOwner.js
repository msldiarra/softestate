import React from 'react'
import Relay from 'react-relay'
import AddOwnerMutation from './AddOwnerMutation'
import AppMessage from './AppMessage';

import UserService from './AuthService'



class NewOwner extends React.Component {


    constructor(props) {
        super(props);
        this.state = {type: 0, message: '' };
    }

    onAddOwner(e) {

        e.preventDefault();

        var company = this.refs.company.value;
        var reference =  this.refs.reference.value;
        var firstName =  this.refs.firstName.value;
        var lastName =  this.refs.lastName.value;
        var phone =  this.refs.phone.value;
        var type =  this.state.type;

        var addOwnerMutation = new AddOwnerMutation({
            viewer: this.props.viewer,
            viewerId: UserService.getUserId(),
            reference: reference,
            type: type,
            company: company,
            firstName: firstName,
            lastName: lastName,
            phone: phone
        });

        var onSuccess = (response) => this.setState({message : "Nouveau propriétaire ajoutée avec succes!"});

        var onFailure = (transaction) => this.setState({message : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
        " Contactez l'administrateur"});

        Relay.Store.commitUpdate(addOwnerMutation, {onSuccess, onFailure});
    }

    handleType(e) {
        this.setState({ type : e.target.value });
    }

    render() {

        const text = this.state.message;

        return (
            <div className="">

                <div className="page-header row">
                    <h4>
                        <span className="col-xs-10"><i className="fa fa-user" aria-hidden="true" /> Nouveau client</span>
                    </h4>
                </div>
                <AppMessage message={text} />
                <form className="form-horizontal padding-20" name="addOwner" >
                    <div className="page-content row">
                        <div className="col-md-6 col-md-offset-1">
                            <div className="form-group">
                                <label htmlFor="reference" className="col-md-3 control-label">Reference</label>
                                <div className="col-md-9">
                                    <input ref="reference" id="reference" type="text" className="form-control" placeholder="reference" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="type" className="col-md-3 control-label">Type de client</label>
                                <div className="col-md-9">
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="individual" value="1" name="type" onClick={this.handleType.bind(this)} /> individu
                                    </label>
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="company" value="2" name="type" onClick={this.handleType.bind(this)} /> entreprise
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-3 control-label">Nom de la société</label>
                                <div className="col-md-9">
                                    <input ref="company" id="name" type="text" className="form-control" placeholder="nom de la société" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-3 control-label">Prénom du contact</label>
                                <div className="col-md-9">
                                    <input ref="firstName" id="first_name" type="text" className="form-control" placeholder="Ex: Mamadou Lamine" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-3 control-label">Nom du contact</label>
                                <div className="col-md-9">
                                    <input ref="lastName" id="last_name" type="text" className="form-control" placeholder="Ex: DIARRA" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-3 control-label">Numéro du contact</label>
                                <div className="col-md-9">
                                    <input ref="phone" id="phone" type="text" className="form-control" placeholder="Ex: 0022373034603" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-3">&nbsp;</div>
                                <div className="col-md-9">
                                    <inupt type="s" className="btn btn-default" onClick={this.onAddOwner.bind(this)}>Enregistrer nouveau client</inupt>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );

    }
}


export default Relay.createContainer(NewOwner, {

    initialVariables: {viewerId: null},

    prepareVariables: prevVariables => {
        return {
            ...prevVariables,
            viewerId: UserService.getUserId() + "",
        };
    },

    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
               id
               message {
                  text
               },
               ${AddOwnerMutation.getFragment('viewer')}
          }
    `,
    }
});