import React from 'react';
import * as globalActions from '../actions/globalActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CommonSVG from '../common/CommonSVG';
import config from '../../config/appConfig';
import classNames from 'classnames';
import {Modal, Button} from 'react-bootstrap';
import Utils from '../common/Utils';


class GlobalMessageModal extends React.Component{
  constructor(props){
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.actions.showHideGlobalMessageModal(false);
  }

  render() {
    return <Modal show={this.props.showGlobalMessage} onHide={this.handleClose}>
              <div className="modal-header">
                <h5 className="modal-title">Message</h5>
                <button type="button" className="close" onClick={this.handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.props.globalMessage}
              </div>
            </Modal>;
  }
}

export default connect(
  state => ({
    globalMessage:state.global.globalMessage,
    showGlobalMessage:state.global.showGlobalMessage
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, globalActions), dispatch)
  })
)(GlobalMessageModal);
