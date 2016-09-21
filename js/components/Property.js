import React from 'react';
import Relay from 'react-relay';
import Images from './Images'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Property extends React.Component {

    render() {

        var property = this.props.property;

        var propertyDisplay = (
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 spacer">
                <div className="full">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{minHeight: '350px'}}>
                            {this.props.property.media && this.props.property.media.edges.length > 0 ?
                                <a href={"/#/property/" + this.props.property.reference }>
                                    <div style={{maxHeight: '250px', overflowY: 'hidden'}}><img src={this.props.property.media.edges[0].node.uri} alt={''}/></div></a> :
                                <a href={"/#/property/" + this.props.property.reference }>
                                    <div style={{maxHeight: '250px', overflowY: 'hidden'}}><img src='/defaults/default.jpg' alt={''}/></div></a> }
                                <div className="row" style={{height:'100px'}}>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        {property.district? <h5>{property.district}, {property.city}</h5> : ''}
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <a className="cblack" href={"/#/property/" + this.props.property.reference }><h4>{this.props.property.name}</h4></a>
                                        <span className="grey">{this.props.property.room_count? this.props.property.room_count + ' chambre(s) - ' : ''}
                                            {this.props.property.price? this.props.property.price + ' FCFA': ''}
                                            {this.props.property.price && property.contract_type==1? ' / mois' : ''}
                                        </span>
                                    </div>
                                </div>
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

