import React from 'react';
import Relay from 'react-relay';
import Images from './Images'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Property extends React.Component {

    render() {

        var property = this.props.property;

        var propertyDisplay = (
            <div className="row" >
                <div className="page-header row">
                    <h4>
                        <span className="col-xs-10"><i className="fa fa-users" aria-hidden="true"></i> {property.name}</span>
                    </h4>
                </div>
                <span>A partir de 7,000 FCFA par mois</span>
                <span>{property.type_label}</span>
                <Images media={property.media} />
            </div>)

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    {propertyDisplay}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

