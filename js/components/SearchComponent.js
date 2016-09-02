import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import UserService from './AuthService'


class SearchComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {searchedText: "", isVisible: false}
    }

    handleSearch(e) {
        var searchedText = ReactDOM.findDOMNode(this.refs.searchInput).value
        this.setState({searchedText: searchedText, isVisible: true},
            () =>  this.props.relay.forceFetch({search: searchedText })
        )

    }


    handlePressEnter(e) {
        if(e.keyCode === 13) {
            const reference = e.target.getAttribute('data-owner-reference');
            ReactDOM.findDOMNode(this.refs.searchInput).value = reference;
            this.props.onOwnerEnter(reference);
            this.setState({searchedText: '', isVisible: false},
                () =>  this.props.relay.forceFetch({search: '' })
            )
        }
    }


    render() {

        var tabIndex =1;

        var owners = this.props.viewer.owners.edges.map(function(edge){

            const fullName = edge.node.contact ? edge.node.contact.first_name+' '+edge.node.contact.last_name: "...";
            tabIndex++;
            return <li key={edge.node.id} data-owner-id={edge.node.id}  data-owner-reference={edge.node.reference} tabIndex={tabIndex} className="row" onKeyDown={this.handlePressEnter.bind(this)} >
                        <div>Réf : {edge.node.reference} - <b>{fullName}</b></div>
                    </li>
        }.bind(this));

        const visibility = this.state.isVisible? "autocomplete col-md-12 col-lg-12 col-xs-12 visible": "autocomplete col-md-12 col-lg-12 col-xs-12 hidden";
        const placeHolder = this.props.placeHolder;



        return (
        <div className="row">
            <div className="col-md-12 col-lg-12 col-xs-12">
            <div className="input-group col-md-12">
                        <span className="input-group-addon" aria-hidden="true" id="basic-addon1">
                            <i className="fa fa-search"></i>
                        </span>
                <input ref="searchInput"
                       type="text"
                       className="form-control"
                       placeholder={placeHolder}
                       aria-describedby="basic-addon1"
                       onChange={this.handleSearch.bind(this)}
                       autoComplete="off"
                       tabIndex="1"
                       defaultValue={this.props.defaultValue}
                />
            </div>
            </div>
            <div className={visibility}>
                <ul>
                    {owners}
                </ul>
            </div>
        </div>)
    }
}

export default Relay.createContainer(SearchComponent, {

    initialVariables: {userID: 1, search: ""},

    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
                id,
                owners(search: $search, first: 10) {
                  edges {
                    node {
                      id
                      reference
                      company
                      type
                      contact {
                        first_name
                        last_name
                      }
                    }
                  },
                },
          }
    `,
    },
});