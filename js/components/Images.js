import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Images extends React.Component {

    render() {
        var images = this.props.media.edges.map(function(edge){
            return <img src={edge.node.uri}  key={edge.node.id} />

        });

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    {images}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}