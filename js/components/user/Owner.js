import React from 'react';
import PropertySummary from '../PropertySummary';

export default class Owner extends React.Component {

    render() {

        var owner = this.props.owner;

        let company = owner.type == 'INDIVIDUAL' ?
            (owner.contact[0]) ? owner.contact[0].first_name+ ' ' + owner.contact[0].last_name : '' :
            owner.company;


        return (
            <div className="full spacer">
                <div className="background-grey padding-20">
                    <h4 className="bold">Référence {owner.reference} {company? ' - '  + company:''}</h4>
                </div>
                <PropertySummary rentSummary={owner.rentSummary} sellSummary={owner.sellSummary} />
            </div>
        );
    }
}