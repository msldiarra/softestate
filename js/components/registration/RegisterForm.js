import React from 'react'
import Relay from 'react-relay'
import crypto from 'crypto';
import Auth from './AuthService'

import AddUserMutation from './AddUserMutation'

class RegisterForm extends React.Component {

    constructor(props) {
        super(props)
    }

    onAddEvent(e) {

        e.preventDefault();

        let login =  this.refs.registerFormEventName.value;
        let password =  this.refs.registerFormPassword.value;
        let confirmPassword =  this.refs.registerFormConfirmPassword.value;
        let email =  this.refs.registerFormEmail.value;
        let confirmEmail = this.refs.registerFormConfirmEmail.value;
        let customer = this.refs.registerFormCustomerName.value;

        if(login && password && email && (password == confirmPassword && email == confirmEmail)) {

            console.log("adding user ...");

            let addUserMutation = new AddUserMutation({
                login: login,
                password: crypto.createHash("sha256").update(password).digest("base64"),
                phone: email,
                firstName: "yo",
                lastName: "yo",
                enabled: true,
                customer: customer,
                viewer: null
            });

            let onSuccess = (response) => {
               this.goToDashboard();
            };

            let onFailure = (transaction) => console.log("error adding user");

            Relay.Store.commitUpdate(addUserMutation, {onSuccess, onFailure})
        }
    }

    goToDashboard() {
        this.context.router.replace('/')
    }

    goToConnectPage(e) {
        e.preventDefault();

       this.goToConnectPage()
    }

    render() {

        return  <form data-toggle="validator" role="form" className="form-registration form-horizontal" name="registerForm" onSubmit={this.onAddEvent.bind(this)}>
                    <h2 className="form-signin-heading text-center cursive">SOFTESTATE</h2>
                    <hr/>
                    <div className="form-group">
                        <label htmlFor="registerFormCustomerName" className="control-label">Name</label>
                        <input ref="registerFormCustomerName" id="registerFormCustomerName" type="text"
                               className="form-control" placeholder="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="registerFormEventName" className="control-label">Login</label>
                        <input ref="registerFormEventName" id="registerFormEventName" type="text"
                               className="form-control" placeholder="login" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="registerFormPassword" className="control-label">Password</label>
                        <input ref="registerFormPassword" id="registerFormPassword" type="password"
                               className="form-control" placeholder="password" required />
                    </div>
                    <div className="form-group">
                        <input ref="registerFormConfirmPassword" id="registerFormConfirmPassword" type="password"
                               className="form-control" placeholder="confirm password"
                               data-match="#registerFormPassword" data-match-error="Whoops, these don't match" required />
                        <div className="help-block with-errors"></div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="registerFormEmail" className="control-label">Email</label>
                        <input ref="registerFormEmail" id="registerFormEmail" className="form-control"
                               placeholder="confirm email" required/>
                    </div>
                    <div className="form-group">
                        <input ref="registerFormConfirmEmail" id="registerFormConfirmEmail"
                               className="form-control" placeholder="confirm email"
                               data-match="#registerFormEmail" data-match-error="Whoops, these don't match" />
                        <div className="help-block with-errors"></div>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-default btn-block btn-lg" type="submit">Inscrivez-vous</button>
                    </div>
                    <hr />
                    <h3>Vous avez déjà un compte ?</h3>
                    <div className="form-group">
                        <button className="btn btn-default btn-block btn-lg" onClick={this.goToConnectPage.bind(this)}>Connectez-vous</button>
                    </div>
                </form>
    }
}

RegisterForm.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default RegisterForm