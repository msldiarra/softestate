import React from 'react'
import Relay from 'react-relay'
import EditOwnerMutation from '../mutation/EditOwnerMutation'
import AppMessage from '../common/AppMessage';
import UserService from '../service/AuthService'


class OwnerEdit extends React.Component {


    constructor(props) {
        super(props);
        this.state = {type: 0, message: ''};
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

        var owner = this.props.viewer.user.owners.edges[0].node;


        var company = this.refs.company.value;
        var reference =  owner.reference;
        var firstName =  names[0];
        var lastName =  names[1];
        var phone =  this.refs.phone.value;
        var type =  this.state.type;

        var editOwnerMutation = new EditOwnerMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
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

        Relay.Store.commitUpdate(editOwnerMutation, {onSuccess, onFailure})
    }

    handleType(e) {
        this.setState({ type : e.target.value });
    }

    componentDidMount() {

        var owner = this.props.viewer.user.owners.edges[0].node;
        this.setState({ type : owner.type_id });
    }

    render() {

        var owner = this.props.viewer.user.owners.edges[0].node;

        const text = this.state.message;

        return (
            <div className="">
                <div className="page-header col-md-6 center-block row">
                    <h3>
                        <span className="col-md-12"><i className="fa fa-user" aria-hidden="true" /> client {owner.reference}</span>
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
                                    <input ref="company" id="company" type="text" className="form-control" placeholder="nom de la société" defaultValue={owner.company} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <input ref="name" id="name" type="text" className="form-control" placeholder="Ex: Mamadou Lamine" defaultValue={owner.contact.first_name+' '+owner.contact.last_name} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <input ref="phone" id="phone" type="text" className="form-control" placeholder="Ex: 0022373034603" defaultValue={owner.contact.info.phone} />
                                </div>
                            </div>
                            <br/>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <inupt type="submit" style={{width:'100%'}}className="btn btn-primary" onClick={this.onAddOwner.bind(this)}><b>Enregistrer les modifications</b></inupt>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );

    }
}

OwnerEdit.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(OwnerEdit, {

    initialVariables: {viewerId: null, search: ''},

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
               user {
                   owners(search: $search, first: 1) {
                      edges {
                        node {
                          id
                          reference
                          company
                          type
                          type_id
                          contact {
                            first_name
                            last_name
                            info {
                               phone
                            }
                          }
                        }
                      },
                    },
                }
               ${EditOwnerMutation.getFragment('viewer')}
          }
    `,
    }
});