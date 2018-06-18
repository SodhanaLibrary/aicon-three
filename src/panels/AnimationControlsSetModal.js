import React from 'react';
import * as appActions from '../actions/appActions'
import * as apiActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CommonSVG from '../common/CommonSVG';
import config from '../../config/appConfig';
import classNames from 'classnames';
import {Modal, Button} from 'react-bootstrap';
import Utils from '../common/Utils';


class AnimationControlsSetModal extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name:props.name || '',
      description:props.description || '',
      category:props.category || '',
      uuid:props.uuid || '',
      animaticonObjName:props.animaticonObjName || ''
    };
    this.handleClose = this.handleClose.bind(this);
    this.saveAnimationControlsSet = this.saveAnimationControlsSet.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
    [event.target.name]:  event.target.value
    });
  }

  handleClose() {
    this.props.actions.showHideAnimationControlsSetModal(false);
  }

  async saveAnimationControlsSet(event) {
    event.preventDefault();
    let animaticonObjNames = this.props.animationControls.map(cntrl => cntrl.group.animaticonObjName);
    animaticonObjNames = animaticonObjNames.filter((cntrl, i) => i === animaticonObjNames.indexOf(cntrl));
    const animaticonObjName = animaticonObjNames[0];
    const subObj = {
      name:this.state.name,
      category:this.state.category,
      description:this.state.description,
      animaticonObjName,
      objJson:JSON.stringify(this.props.animationControls.map(cnt => cnt.toJson()))
    };
    await Utils.apiFetch("POST_ANIMATION_CONTROLS", subObj);
    this.props.actions.clearPreDefinedAnimationControlSets(animaticonObjNames[0]);

    let res = [];
    if(this.props.selectedGroup) {
      res = await Utils.apiFetch("GET_PRE_DEFINED_ANIMATION_CONTROLS", {
        animaticonObjName
      });
    }
    this.props.actions.setPreDefinedAnimationControlSets({
      animaticonObjName,
      animationControlSets:res
    });
    this.handleClose();
  }

  render() {
    return <Modal show={this.props.showAnimationControlsSetModal} onHide={this.handleClose}>
              <div className="modal-header">
                <h5 className="modal-title">Pre-defined animations</h5>
                <button type="button" className="close" onClick={this.handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.saveAnimationControlsSet}>
                  <div className="form-group row">
                    <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Name</label>
                    <div className="col-sm-8">
                      <input type="text" className="form-control" name="name" required={true} value={this.state.name} onChange={this.handleChange}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Category</label>
                    <div className="col-sm-8">
                      <input type="text" name="category" className="form-control" required={true} value={this.state.category} onChange={this.handleChange}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Description</label>
                    <div className="col-sm-8">
                      <textarea type="text" name="description" className="form-control" required={true} value={this.state.description} onChange={this.handleChange}></textarea>
                    </div>
                  </div>
                  <div className="form-group modal-footer--buttons ">
                    <button type="submit" className="btn btn-secondary">Submit</button>
                  </div>
                </form>
              </div>
            </Modal>;
  }
}

export default connect(
  state => ({
    selectedGroup:state.app.selectedGroup,
    animationControls:state.animation.controls,
    showAnimationControlsSetModal:state.animation.showAnimationControlsSetModal
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, animationActions), dispatch)
  })
)(AnimationControlsSetModal);
