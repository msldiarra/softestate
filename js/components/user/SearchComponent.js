import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import UserService from '../service/AuthService'


class SearchComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {searchedText: "", isVisible: false}
    }

    handleSearch(e) {
        e.preventDefault();
        var searchedText = ReactDOM.findDOMNode(this.refs.searchInput).value
        this.setState({searchedText: searchedText, isVisible: true},
            () =>  this.props.relay.forceFetch({search: searchedText })
        )

    }

    handlePressEnter(e) {

        e.preventDefault();

        if(e.keyCode === 13 ) {
            const reference = e.target.getAttribute('data-owner-reference');
            ReactDOM.findDOMNode(this.refs.searchInput).value = reference;
            this.props.onOwnerEnter(reference);
            this.setState({searchedText: '', isVisible: false},
                () =>  this.props.relay.forceFetch({search: '' })
            )
        }
    }

    handleClick(e) {

        e.preventDefault();

        var target = e.target;

        while(target && target.parentNode.tagName != 'UL') {
            target = target.parentNode;
            if(!target) return;
        }

        if(target.tagName == 'LI') {

            const reference = target.getAttribute('data-owner-reference');
            ReactDOM.findDOMNode(this.refs.searchInput).value = reference;
            this.props.onOwnerEnter(reference);
            this.setState({searchedText: '', isVisible: false},
                () =>  this.props.relay.forceFetch({search: '' })
            )
        }
    }


    handleDocumentClick = (e) =>  {

        const area = ReactDOM.findDOMNode(this.refs.area);
        if(!area.contains(e.target)) {
            this.setState({isVisible: false})
        }
    }

    componentDidMount() {

        document.getElementById('root').addEventListener('click', this.handleDocumentClick);
    }

    componentWillUnmount(){
        document.getElementById('root').removeEventListener('click', this.handleDocumentClick);
    }

    render() {

        var tabIndex = 2;

        var owners = this.props.viewer.user.owners.edges.map(function(edge){

            const fullName = edge.node.contact && edge.node.contact.first_name ? edge.node.contact.first_name+' '+edge.node.contact.last_name: "...";
            tabIndex++;

            return <li key={edge.node.id} data-owner-id={edge.node.id}  data-owner-reference={edge.node.reference} tabIndex={tabIndex} className="col-md-12 col-lg-12 col-xs-12"
                       onClick={this.handleClick.bind(this)}  onKeyDown={this.handlePressEnter.bind(this)} >
                        <div><b>{fullName} (réf. : {edge.node.reference})</b></div>
                    </li>
        }.bind(this));

        const visibility = this.state.isVisible? "visible": "hidden";
        const placeHolder = this.props.placeHolder;

        return (
        <div  ref="area" className="row">
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
                <div className="autocomplete col-md-12 col-lg-12 col-xs-12 row" style={{visibility :  visibility}}>
                    <ul id="owners" tabIndex="1" className="col-md-12 col-lg-12 col-xs-12">
                        {owners}
                    </ul>
                </div>
        </div>)
    }
}

export default Relay.createContainer(SearchComponent, {

    initialVariables: {viewerId: 1, search: ""},

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
                id,
                user{
                    id
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
          }
    `,
    },
});