import React from 'react';

export default class Property extends React.Component {

    render() {

        var rent = this.props.rentSummary;
        var sell = this.props.sellSummary;

        var toRent, toSell;
        if(rent) {
            toRent = <div className="row">
                        <span className="col-xs-3">Location</span>
                        <span className="col-xs-3 text-center"><i className="fa fa-building opacity-54"></i> <b className="">{rent.apartmentCount}</b></span>
                        <span className="col-xs-3 text-center"><i className="fa fa-university opacity-54"></i> <b className="">{rent.houseCount}</b></span>
                        <span className="col-xs-3 text-center"><i className="fa fa-map-marker opacity-54"></i> <b className="">{rent.landCount}</b></span>
                    </div>
        } else {
            toRent = <div className="row">
                        <span className="col-xs-3">Location</span>
                        <span className="col-xs-3 text-center"><i className="fa fa-building opacity-54"></i> <b className="">0</b></span>
                        <span className="col-xs-3 text-center"><i className="fa fa-university opacity-54"></i> <b className="">0</b></span>
                        <span className="col-xs-3 text-center"><i className="fa fa-map-marker opacity-54"></i> <b className="">0</b></span>
                    </div>
        }

        if(sell) {
            toSell = <div className="row">
                        <span className="col-xs-3">Vente</span>
                        <span className="col-xs-3 text-center"><i className="fa fa-building opacity-54"></i> <b className="">{sell.apartmentCount}</b></span>
                        <span className="col-xs-3 text-center"><i className="fa fa-university opacity-54"></i> <b className="">{sell.houseCount}</b></span>
                        <span className="col-xs-3 text-center"><i className="fa fa-map-marker opacity-54"></i> <b className="">{sell.landCount}</b></span>
                    </div>
        } else {
            toSell = <div className="row">
                        <span className="col-xs-3">Vente</span>
                        <span className="col-xs-3 text-center"><i className="fa fa-building opacity-54"></i> <b className="">0</b></span>
                        <span className="col-xs-3 text-center"><i className="fa fa-university opacity-54"></i> <b className="">0</b></span>
                        <span className="col-xs-3 text-center"><i className="fa fa-map-marker opacity-54"></i> <b className="">0</b></span>
                    </div>
        }

        return (
                <div className="padding-10">
                    <br/>
                    {toRent}
                    <br/>
                    <br/>
                    {toSell}
                </div>
        );
    }
}