import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Slider from 'react-slick'

export default class Images extends React.Component {

    render() {

        const settings = {
            dots: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            pauseOnHover: true
        };

        var images = this.props.media.edges.map(function(edge){
            return <div key={edge.node.id}><img src={edge.node.uri} /></div>

        });

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    <Slider {...settings}>
                        {images}
                    </Slider>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}