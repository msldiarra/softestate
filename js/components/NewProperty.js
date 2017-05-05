import React from 'react'
import Relay from 'react-relay'
import AddPropertyMutation from './AddPropertyMutation'
import AttachMediaMutation from './AttachMediaMutation'
import AppMessage from './AppMessage';
import SearchComponent from './SearchComponent';
import AttachMedia from './AttachMedia';
import UserService from './AuthService'
import {EditorState} from 'draft-js';
import RichEditor from './RichEditor';
import ReactDOM from 'react-dom';
import Chance from 'chance';



class NewProperty extends React.Component {

    constructor(props) {
        super(props);
        this.state = {propertyType : 0,
            contractType : 0,
            ownerRef: '',
            message : "",
            mediaNames: [],
            floorCount: 1,
            roomCount: 1
        } ;
    }

    onAddProperty(e) {

        e.preventDefault();

        var name = new Chance().word({length: 12});
        var reference =  new Chance().word({length: 12});
        var propertyType =  this.state.propertyType;
        var contractType =  this.state.contractType;
        var description =  ''
        var size = this.refs.size.value;
        var unit = this.refs.unit.value;
        var floorCount = this.state.floorCount;
        var roomCount = this.state.roomCount;
        var city = this.refs.city.value;
        var price = this.refs.price.value;
        var owner = this.state.ownerRef;
        var mediaNames = this.state.mediaNames;


        var addPropertyMutation = new AddPropertyMutation({
            viewer: this.props.viewer,
            viewerId: UserService.getUserId(),
            name: name,
            reference: reference,
            propertyType: propertyType,
            contractType: contractType,
            description: description,
            size: size,
            sizeUnit: unit,
            floorCount: floorCount,
            roomCount: roomCount,
            price: price,
            city: city,
            ownerRef: owner,
            mediaNames: mediaNames
        });

        var onSuccess = () => this.context.router.push('/admin/property/' + reference);

        var onFailure = (transaction) => this.setState({message : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
        " Contactez l'administrateur"});

        Relay.Store.commitUpdate(addPropertyMutation, {onSuccess, onFailure})

    }

    onMediaInsert(file, uri) {

        var onSuccess = (response) => this.setState({message: "Nouvelle image ajoutée avec succes!"});
        var onFailure = (transaction) => this.setState({message: transaction});

        Relay.Store.commitUpdate(
            new AttachMediaMutation({
                viewer: this.props.viewer,
                viewerId: UserService.getUserId(),
                uri: uri,
                name: file.name,
                file: file
            }, {onSuccess, onFailure})
        );
    }

    onAddMedia(mediaNames) {
        var names = this.state.mediaNames;
        names.push(mediaNames);
        this.setState({mediaNames: names});
    }

    changePropertyType(e) {
        this.setState({propertyType: e.target.value});
    }

    changeContractType(e) {
        this.setState({contractType: e.target.value});
    }

    onDecrementFloor(e) {
        var value = parseInt(this.state.floorCount) - 1;
        this.setState({floorCount: value});
    }

    onIncrementFloor(e) {
        var value = parseInt(this.state.floorCount) + 1;
        this.setState({floorCount: value});
    }

    onDecrementRoom(e) {
        var value = parseInt(this.state.roomCount) - 1;
        this.setState({roomCount: value});
    }

    onIncrementRoom(e) {
        var value = parseInt(this.state.roomCount) + 1;
        this.setState({roomCount: value});
    }

    onOwnerEnter(reference) {
        this.setState({ownerRef: reference});
    }

    render() {
        const text = this.state.message;


        return (
            <div className="">
                <div className="page-header col-md-6 center-block row">
                    <h3>
                        <span className="col-md-12"><i className="fa fa-home" aria-hidden="true" /> Nouvelle propriété</span>
                    </h3>
                </div>

                {text? <AppMessage message={text} /> : ''}

                <form className="form-horizontal padding-20" name="add-property">
                    <div className="page-content row">
                        <div className="col-md-6 center-block">
                            <div className="form-group">
                                <div className="col-md-12">
                                    <SearchComponent viewerId={UserService.getUserId()}
                                                     search="" placeHolder="Entrer le nom du Propriétaire"
                                                     onOwnerEnter={this.onOwnerEnter.bind(this)}
                                                     defaultValue=""
                                        {...this.props} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <input ref="city" id="city" type="text" className="form-control" placeholder="Saisissez la ville ou se trouve le bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="btn-group btn-group-justified col-md-12" role="group" >
                                    <div className="btn-group" role="group">
                                        <button onClick={this.changePropertyType.bind(this)} type="button" className={"btn btn-default " + (this.state.propertyType ==  1? "active" : "")} value="1">Appart.</button>
                                    </div>
                                    <div className="btn-group" role="group">
                                        <button onClick={this.changePropertyType.bind(this)} type="button" className={"btn btn-default " + (this.state.propertyType ==  2? "active" : "")} value="2">Villa</button>
                                    </div>
                                    <div className="btn-group" role="group">
                                        <button onClick={this.changePropertyType.bind(this)} type="button" className={"btn btn-default " + (this.state.propertyType ==  3? "active" : "")} value="3">Terrain</button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="btn-group btn-group-justified col-md-12" role="group" >
                                    <div className="btn-group" role="group">
                                        <button onClick={this.changeContractType.bind(this)} type="button" className={"btn btn-default " + (this.state.contractType ==  1? "active" : "")} value="1">Location</button>
                                    </div>
                                    <div className="btn-group" role="group">
                                        <button onClick={this.changeContractType.bind(this)} type="button" className={"btn btn-default " + (this.state.contractType ==  2? "active" : "")} value="2">Vente</button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <AttachMedia viewer={this.props.viewer} onAddMedia={this.onAddMedia.bind(this)} onMediaInsert={this.onMediaInsert.bind(this)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <div className="input-group col-md-12">
                                        <span className="input-group-addon">Prix en CFA</span>
                                        <input type="text" ref="price" id="price" className="form-control" placeholder="Loyer ou prix de vente" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <div className="input-group col-xs-12">
                                        <input type="text" ref="size" id="size" className="form-control" style={{width:'70%'}} placeholder="Superficie totale du bien" />
                                        <select ref="unit" className="form-control text-center" style={{width:'30%', fontWeight:'600'}} >
                                            <option value="m²" style={{fontWeight:'600'}} >m²</option>
                                            <option value="ha" style={{fontWeight:'600'}} >ha</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <button type="button" className="btn btn-default" >
                                        <i className="fa fa-building" /> <b>{this.state.floorCount}</b> étage
                                    </button>
                                    <div className="col-xs-6 pull-right">
                                        <button type="button" onClick={this.onDecrementFloor.bind(this)} className="btn btn-default"> <i className="fa fa-minus" /> </button>
                                        <button type="button" onClick={this.onIncrementFloor.bind(this)} className="btn btn-default"> <i className="fa fa-plus" /> </button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <button type="button" className="btn btn-default" >
                                        <i className="fa fa-bed" /> <b>{this.state.roomCount}</b> chambres
                                    </button>
                                    <div className="col-xs-6 pull-right">
                                        <button type="button" onClick={this.onDecrementRoom.bind(this)} className="btn btn-default"> <i className="fa fa-minus" /> </button>
                                        <button type="button" onClick={this.onIncrementRoom.bind(this)} className="btn btn-default"> <i className="fa fa-plus" /> </button>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <inupt type="submit" style={{width:'100%'}}className="btn btn-primary" onClick={this.onAddProperty.bind(this)}><b>Enregistrer la nouvelle propriété</b></inupt>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}


NewProperty.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(NewProperty, {

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
               id,
               ${AddPropertyMutation.getFragment('viewer')}
               ${SearchComponent.getFragment('viewer')}
               ${AttachMediaMutation.getFragment('viewer')}
          }
    `,
    }
});
