import React from 'react';
import Relay from 'react-relay';
import Images from './Images'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Link} from 'react-router';


export default class Property extends React.Component {

    render() {

        var property = this.props.property;
        let pathname = this.context.location.pathname != '/' ? this.context.location.pathname: '';

        var propertyDisplay = (
            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 item-container">
                <div className="">
                    <div className="row item" >
                        <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5 property-image" >
                            {this.props.property.media.edges && this.props.property.media.edges.length > 0 ?
                                <Link to={pathname + "/property/" +  this.props.property.reference}>
                                    <div style={{overflowY: 'hidden'}}><img src={this.props.property.media.edges[0].node.uri} alt={''}/></div>
                                </Link> :
                                <Link to={pathname + "/property/" +  this.props.property.reference}>
                                    <div style={{overflowY: 'hidden'}}><img src='/defaults/default.jpg' alt={''}/></div>
                                </Link>
                            }
                            </div>
                            <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7 property-details"  >
                                    <span style={{fontWeight:400, color:'#000'}}>{this.props.property.room_count? this.props.property.room_count + ' chambre(s) ' : ''}</span>
                                    <br/>
                                    <br/>
                                    <span className="grey">{this.props.property.size? this.props.property.size + 'm2 ' : ''}</span>
                                    <br/>
                                    <br/>
                                    <span style={{ fontWeight:700, color:'#000', verticalAlign:'bottom'}} >{this.props.property.price? this.props.property.price + ' FCFA': ''}</span>
                            </div>
                    </div>
                </div>
            </div>
        )

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    {propertyDisplay}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

Property.contextTypes = {
    router: React.PropTypes.object.isRequired,
    location: React.PropTypes.object
};