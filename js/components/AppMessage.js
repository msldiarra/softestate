import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class AppMessage extends React.Component {

    render() {
        var text = this.props.message? this.props.message.text: '';

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    {text}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}