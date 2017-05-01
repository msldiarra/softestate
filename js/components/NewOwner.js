import React from 'react'
import Relay from 'react-relay'
import AddOwnerMutation from './AddOwnerMutation'
import AppMessage from './AppMessage';
import UserService from './AuthService';
import Chance from 'chance';


class NewOwner extends React.Component {


    constructor(props) {
        super(props);
        this.state = {type: 0, message: '' };
    }

    onAddOwner(e) {

        e.preventDefault();

        var company = this.refs.company.value;
        var reference =  new Chance().word({length: 12});
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

        var onSuccess = () => this.context.router.push('/owner/' + reference);

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

                <div className="page-header col-md-6 center-block row">
                    <h3>
                        <span className="col-md-12"><i className="fa fa-user" aria-hidden="true" /> Nouveau client</span>
                    </h3>
                </div>
                {text? <AppMessage message={text} /> : ''}
                <form className="form-horizontal padding-20" name="add-owner" >
                    <div className="page-content row">
                        <div className="col-md-6 center-block">
                            <div className="form-group">
                                <label htmlFor="type" className="col-md-12">Type de client</label>
                                <div className="col-md-12">
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="individual" value="1" name="type" onClick={this.handleType.bind(this)} /> individu
                                    </label>
                                    <label className="radio-inline control-label">
                                        <input type="radio" id="company" value="2" name="type" onClick={this.handleType.bind(this)} /> entreprise
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Nom de la société</label>
                                <div className="col-md-12">
                                    <input ref="company" id="name" type="text" className="form-control" placeholder="nom de la société" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Prénom du contact</label>
                                <div className="col-md-12">
                                    <input ref="firstName" id="first_name" type="text" className="form-control" placeholder="Ex: Mamadou Lamine" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Nom du contact</label>
                                <div className="col-md-12">
                                    <input ref="lastName" id="last_name" type="text" className="form-control" placeholder="Ex: DIARRA" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Numéro du contact</label>
                                <div className="col-md-12">
                                    <input ref="phone" id="phone" type="text" className="form-control" placeholder="Ex: 0022373034603" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-3">&nbsp;</div>
                                <div className="col-md-12">
                                    <inupt type="s" className="btn btn-primary" onClick={this.onAddOwner.bind(this)}>Enregistrer nouveau client</inupt>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );

    }
}

NewOwner.contextTypes = {
    router: React.PropTypes.object.isRequired
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
          fragment on Viewer {
               id
               ${AddOwnerMutation.getFragment('viewer')}
          }
    `,
    }
});