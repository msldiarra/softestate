import React from 'react'
import Relay from 'react-relay'
import AddOwnerMutation from './AddOwnerMutation'

class NewOwner extends React.Component {


    constructor() {
        super();
        this.state = {type: 0 };
    }

    onAddOwner(e) {

        e.preventDefault();

        var name = this.refs.name.value;
        var reference =  this.refs.reference.value;
        var type =  this.state.type;

        var addOwnerMutation = new AddOwnerMutation({
            viewer: this.props.viewer,
            reference: reference,
            name: name,
            type: type
        });

        var onSuccess = (response) => { alert("Test success"); };

        var onFailure = (transaction) => console.log("An error occurred when adding new event", "error");

        Relay.Store.commitUpdate(addOwnerMutation, {onSuccess, onFailure})
    }

    handleType(e) {
        this.setState({ type : e.target.value });
    }

    render() {

        return (
            <div className="">
                <div className="page-header row">
                    <h4>
                        <span className="col-xs-10"><i className="fa fa-user" aria-hidden="true" /> Nouveau client</span>
                    </h4>
                </div>


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
                                <label htmlFor="name" className="col-md-3 control-label">Nom</label>
                                <div className="col-md-9">
                                    <input ref="name" id="name" type="text" className="form-control" placeholder="nom" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="type" className="col-md-3 control-label">Type</label>
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
    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
               ${AddOwnerMutation.getFragment('viewer')}
               id
               customer
          }
    `,
    }
});