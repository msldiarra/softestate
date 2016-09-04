import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import AttachMediaMutation from './AttachMediaMutation'
import UserService from './AuthService'

export default class AttachMedia extends React.Component {


    onMediaInsert() {

        const file = this.refs.fileInput.files.item(0);
        const uri = '/images/' + file.name;

        this.props.onMediaInsert(file, uri);
        this.props.onAddMedia(file.name);

    }

    render() {

        return (
            <div className="row">
                <div className="col-md-12 col-lg-12 col-xs-12">
                    <div className="input-group col-md-12">
                         <input ref="fileInput"
                                type="file"
                                multiple
                                onChange={this.onMediaInsert.bind(this)}
                        />
                    </div>
                </div>

            </div>)
    }
}