import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

export default class Header extends React.Component {

    render() {

        var headerItems = "";

        if (!!this.props.user) {
            headerItems =
                <ul className="nav navbar-nav navbar-right">
                    <li className=""><Link to="/newowner">Ajouter un client</Link></li>
                    <li className=""><Link to="/newproperty">Ajouter une propriété</Link></li>
                    <li><a href="" onClick={this.props.onLogout}>Déconnexion</a></li>
                </ul>
        }


        let header =
                <nav className="navbar navbar-custom navbar-fixed-top" role="navigation">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse"
                                    data-target=".navbar-ex1-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">SOFTESTATE
                                <small>{this.props.user ? ' (' + this.props.user.customer + ')' : '' }</small>
                            </a>
                        </div>
                        <div className="collapse navbar-collapse navbar-ex1-collapse">
                            {headerItems}
                        </div>
                    </div>
                </nav>


        return header;
    }
}
