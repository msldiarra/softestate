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

    computeName(names) {

        let name = names? names.split(" "): [];
        var lastName = name[name.length - 1];
        var firstName = "";

        for(var i=0; i < name.length - 1; i++) {
            firstName = firstName.concat(" ", name[i]);
        }

        return [firstName, lastName];
    }

    onAddOwner(e) {

        e.preventDefault();

        let names = this.computeName(this.refs.name.value);

        var company = this.refs.company.value;
        var reference =  new Chance().word({length: 12});
        var firstName =  names[0];
        var lastName =  names[1];
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

        var onSuccess = () => this.context.router.push('/admin/owner/' + reference);

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
                                <div className="btn-group btn-group-justified col-md-12" role="group" >
                                    <div className="btn-group" role="group">
                                        <button onClick={this.handleType.bind(this)} type="button" className={"btn btn-default " + (this.state.type ==  1? "active" : "")} value="1" >
                                            Une personne
                                        </button>
                                    </div>
                                    <div className="btn-group" role="group">
                                        <button onClick={this.handleType.bind(this)} type="button" className={"btn btn-default " + (this.state.type ==  2? "active" : "")} value="2" >
                                            Une entreprise
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <input ref="company" id="company" type="text" className="form-control" placeholder="Nom de la société" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <input ref="name" id="name" type="text" className="form-control" placeholder="Ex: Mamadou DIARRA" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <input ref="phone" id="phone" type="text" className="form-control" placeholder="Ex: 0022373034603" />
                                </div>
                            </div>
                            <br/>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <inupt type="submit" style={{width:'100%'}}className="btn btn-primary" onClick={this.onAddOwner.bind(this)}><b>Enregistrer le nouveau client</b></inupt>
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
            viewerId: UserService.getUserId(),
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