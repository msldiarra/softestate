import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class OwnerDetails extends React.Component {


    componentDidMount() {

        var owner = this.props.viewer.user.owners.edges.length > 0 ? this.props.viewer.user.owners.edges[0].node: null;
        if(!owner)
            this.context.router.replace('/');

    }

    render() {

        var ownerDisplay = '';
        var owner = this.props.viewer.user.owners.edges.length > 0 ? this.props.viewer.user.owners.edges[0].node: null;

        if(owner)
            ownerDisplay = (
                <div className="row padding-25">
                    <div className="col-md-8 center-block">
                        <h4 className="row">
                            <div className="col-md-8 col-xs-8 col-sm-8"><i className="fa fa-user" aria-hidden="true" /> Client</div>
                            <div className="pull-right padding-right-15">
                                <a href={'/#/admin/owner/' + owner.reference + '/edit'}>
                                    <div className="circle text-center"><i className="fa fa-pencil" aria-hidden="true" /></div>
                                </a>
                            </div>
                        </h4>

                        <hr/>
                        <dl className="row" >
                            <dt></dt>
                            <dd>
                                {owner.company ?
                                    <div><label>Société: </label> {owner.company}</div> :
                                    ""
                                }
                                <div><label>Nom: </label> {owner.contact.first_name + ' ' + owner.contact.last_name}</div>
                                <div><label>Téléphone: </label> {owner.contact.info.phone}</div>
                            </dd>
                        </dl>
                    </div>
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
          fragment on Viewer {
                id,
                user {
                    id
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
          }
    `,
    },
});

