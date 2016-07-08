import React from 'react';
import Property from './Property';

export default class Owner extends React.Component {

    render() {

        var owner = this.props.owner;

        console.log(owner);


        let company = owner.type == 'INDIVIDUAL' ?
            owner.contact[0].first_name+ ' ' + owner.contact[0].last_name :
            owner.name;


        return (
            <div className="full spacer">
                <div className="background-grey padding-20">
                    <h4 className="bold">Référence {owner.reference} {company? ' - '  + company:''}</h4>
                </div>
                <Property rentSummary={owner.rentSummary} sellSummary={owner.sellSummary} />
            </div>
        );
    }
}