import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class StationTanks extends React.Component {

    render() {



        return (
            <div className="padding-25">
                <h2>{this.props.name}</h2>
                <hr/>
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}