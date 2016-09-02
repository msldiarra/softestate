import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class AppMessage extends React.Component {

    render() {

        var text = this.props.message;

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="test" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    <div>{text}</div>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}