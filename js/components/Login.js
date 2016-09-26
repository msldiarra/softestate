import React from 'react';
import Auth from './AuthService';
import RegisterForm from './registration/RegisterForm'

class Login extends React.Component {

    constructor() {
        super()
        this.state = {
            user: '',
            password: '',
            authenticationError: false
        };
    }

    login(e) {

        e.preventDefault();

        Auth.login(this.refs.user.value, this.refs.password.value)
            .then((loggedIn) => {

                if (!loggedIn) return this.setState({authenticationError: true});
                const { location } = this.props;

                if (location.state && location.state.nextPathname) {
                    this.context.router.replace(location.state.nextPathname)
                } else {
                    this.context.router.replace('/')
                }

            });
    }

    register(e) {

        e.preventDefault();

        this.context.router.replace('/register')

    }

    render() {
        return (
            <div>
                <form className="form-signin">
                    <h2 className="form-signin-heading text-center cursive">SOFTESTATE</h2>
                    <hr/>
                    <div className="form-group">
                        <label htmlFor="username" className="sr-only">Identifiant</label>
                        <input type="text" ref="user" className="form-control"
                               placeholder="Identifiant" autoFocus="true"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="sr-only">Mot de passe</label>
                        <input type="password" ref="password" className="form-control"
                               placeholder="Mot de passe"/>
                    </div>
                    <button className="btn btn-default btn-block btn-lg" type="submit" onClick={this.login.bind(this)}>
                        Connectez-vous
                    </button>
                    {this.state.authenticationError && (
                        <p>Mauvais paramètres d'authentification</p>
                    )}
                    <br />
                    <hr />
                    <br />
                    <button className="btn btn-default btn-block btn-lg" onClick={this.register.bind(this)}>
                        Créez un compte
                    </button>
                </form>

                <br/>
                <footer className="text-center">&copy;2016 UL- L'Usine Logicielle SARL</footer>
                <br/>
            </div>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Login