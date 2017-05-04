import React from 'react'
import Relay from 'react-relay'
import EditPropertyMutation from './EditPropertyMutation'
import AppMessage from './AppMessage';
import SearchComponent from './SearchComponent';
import AttachMedia from './AttachMedia';
import UserService from './AuthService'
import ReactDOM from 'react-dom'
import AttachMediaMutation from './AttachMediaMutation'
import {EditorState, ContentState} from 'draft-js';
import RichEditor from './RichEditor';


class PropertyDetailsEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type_id : 0,
            contractType : 0,
            ownerRef: '',
            message : "",
            mediaNames: [],
            floorCount: 1,
            roomCount: 1
        } ;
    }


    onEditDescription(editorState){

        this.setState({editorState});
    }

    onEditProperty(e) {

        e.preventDefault();

        var property = this.props.viewer.properties.edges[0].node;

        var type_id =  this.state.type_id;
        var contractType =  this.state.contractType;
        var description =  ''; //this.state.editorState.getCurrentContent().getPlainText();
        var size = this.refs.size.value;
        var floorCount = this.state.floorCount;
        var roomCount = this.state.roomCount;
        var price = this.refs.price.value;
        var city = this.refs.city.value;
        var owner = this.state.ownerRef;
        var mediaNames = this.state.mediaNames;


        var editPropertyMutation = new EditPropertyMutation({
            viewer: this.props.viewer,
            viewerId: UserService.getUserId(),
            reference: property.reference,
            propertyType: type_id,
            contractType: contractType,
            description: description,
            size: size,
            floorCount: floorCount,
            roomCount: roomCount,
            price: price,
            ownerRef: owner,
            location: city,
            mediaNames: mediaNames
        });

        var onSuccess = () => this.context.router.push('/admin/property/' + property.reference);

        var onFailure = (transaction) => {
            console.log(transaction.getError());
            this.setState({message : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
            " Contactez l'administrateur" });
        }

        Relay.Store.commitUpdate(editPropertyMutation, {onSuccess, onFailure})

    }

    onMediaInsert(file, uri) {

        var onSuccess = (response) => this.setState({message: "Nouvelle image ajoutée avec succes!"});
        var onFailure = (transaction) => {
            this.setState({message: "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
            " Contactez l'administrateur"});
        }

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

    onAddMedia(mediaName) {
        var names = this.state.mediaNames;
        names.push(mediaName);
        this.setState({mediaNames: names});
    }

    changePropertyType(e) {
        this.setState({ type_id : e.target.value });
    }

    changeContractType(e) {
        this.setState({ contractType : e.target.value });
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

    componentDidMount() {

        var property = this.props.viewer.properties.edges[0].node;

        this.setState({ type_id : property.type_id });
        this.setState({ contractType : property.contract_type });
        this.setState({ floorCount : property.floor_count });
        this.setState({ roomCount : property.room_count });

    }

    render() {

        var property = this.props.viewer.properties.edges[0].node;

        const text = this.state.message;

        return (
            <div className="">
                <div className="page-header col-md-6 center-block row">
                    <h3>
                        <span className="col-md-12"><i className="fa fa-home" aria-hidden="true" /> Propriété</span>
                    </h3>
                </div>

                {text? <AppMessage message={text} /> : ''}

                <form className="form-horizontal padding-20" name="edit-property" >
                    <div className="page-content row">
                        <div className="col-md-6 center-block">
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-12">Propriétaire</label>
                                <div className="col-md-12">
                                    <SearchComponent userID={UserService.getUserId()}
                                                     search="" placeHolder="Entrer le nom du Propriétaire"
                                                     onOwnerEnter={this.onOwnerEnter.bind(this)}
                                                     defaultValue={property.owner.reference}
                                        {...this.props} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <input ref="city" id="city" type="text" defaultValue={property.location} className="form-control" placeholder="Saisissez la ville ou se trouve le bien" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="btn-group btn-group-justified col-md-12" role="group" >
                                    <div className="btn-group" role="group">
                                        <button onClick={this.changePropertyType.bind(this)} type="button" className={"btn btn-default " + (this.state.type_id ==  1? "active" : "")} value="1">Appart.</button>
                                    </div>
                                    <div className="btn-group" role="group">
                                        <button onClick={this.changePropertyType.bind(this)} type="button" className={"btn btn-default " + (this.state.type_id ==  2? "active" : "")} value="2">Villa</button>
                                    </div>
                                    <div className="btn-group" role="group">
                                        <button onClick={this.changePropertyType.bind(this)} type="button" className={"btn btn-default " + (this.state.type_id ==  3? "active" : "")} value="3">Terrain</button>
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
                                        <input type="text" ref="price" id="price" defaultValue={property.price} className="form-control" placeholder="Loyer ou prix de vente" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <div className="input-group col-xs-12">
                                        <input type="text" ref="size" id="size" defaultValue={property.size} className="form-control" style={{width:'70%'}} placeholder="Superficie totale du bien" />
                                        <select className="form-control text-center" style={{width:'30%', fontWeight:'600'}} >
                                            <option value="1" style={{fontWeight:'600'}} >m²</option>
                                            <option value="2" style={{fontWeight:'600'}} >ha</option>
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
                                    <inupt type="submit" style={{width:'100%'}}className="btn btn-primary" onClick={this.onEditProperty.bind(this)}><b>Enregistrer la nouvelle propriété</b></inupt>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );

    }
}

PropertyDetailsEdit.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(PropertyDetailsEdit, {

    initialVariables: {reference: ''},

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
                id,
                properties(reference: $reference, first: 10) {
                  edges {
                    node {
                      id
                      reference
                      name
                      type_id
                      contract_type
                      location
                      size
                      floor_count
                      room_count
                      price
                      description
                      owner {
                        reference
                      }
                      media(first: 10) {
                        edges {
                            node {
                                uri
                            }
                        }
                      }
                    }
                  },
                },
                ${EditPropertyMutation.getFragment('viewer')}
                ${SearchComponent.getFragment('viewer')}
                ${AttachMediaMutation.getFragment('viewer')}
          }
    `,
    },
});
