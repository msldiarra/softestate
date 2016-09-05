import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class OwnerDetails extends React.Component {


    componentDidMount() {

        var owner = this.props.viewer.owners.edges.length > 0 ? this.props.viewer.owners.edges[0].node: null;
        if(!owner)
            this.context.router.replace('/');

    }

    render() {

        var ownerDisplay = '';
        var owner = this.props.viewer.owners.edges.length > 0 ? this.props.viewer.owners.edges[0].node: null;

        if(owner)
            ownerDisplay = (
                <div className="row" >
                    <div className="page-header row">
                        <h4>
                            <span className="col-xs-10"><i className="fa fa-users" aria-hidden="true"></i> {owner.reference}</span>
                        </h4>
                    </div>
                    <span>{owner.company}</span>
                    <span>{owner.contact.first_name + ' ' + owner.contact.last_name}</span>
                    <span>{owner.contact.info.phone}</span>
                </div>)

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    {ownerDisplay}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

OwnerDetails.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(OwnerDetails, {

    initialVariables: {search: ''},

    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
                id,
                owners(search: $search, first: 1) {
                  edges {
                    node {
                      id
                      reference
                      company
                      type
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
    `,
    },
});

