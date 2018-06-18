import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';

class RotateAnimationControlForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupItemId:null,
      from:0,
      angle:Math.PI/12,
      duration:1,
      startAt:0,
      target:null,
      open:true
    };
    this.handleChange = this.handleChange.bind(this);
    this.addControl = this.addControl.bind(this);
    this.modifyControl = this.modifyControl.bind(this);
    this.decreaseAngle = this.decreaseAngle.bind(this);
    this.increaseAngle = this.increaseAngle.bind(this);
  }

  handleChange(event) {
    this.setState({
    [event.target.name]:  event.target.value
    });
    if(event.target.name === 'groupItemId') {
      const controls = this.props.selectedGroup ? this.props.selectedGroup.getControls() : {};
      const bone3 = controls.bones.find(bone => bone.props.id === event.target.value);
      if(bone3) {
        this.setState({
          from : bone3.getAngle(),
          target : bone3.bone
        });
      } else {
        this.setState({
        [event.target.name]: null
        });
      }
    }
  }

  addControl(event) {
    const {duration, from, angle, startAt} = this.state;
    event.preventDefault();
    const frame = new window.animaticonObjects.RotateAnimationControl3({
      duration,
      from,
      angle,
      group:this.props.selectedGroup,
      groupItem:this.state.groupItemId,
      startAt});
    frame.init();
    this.props.actions.addAnimationControl(frame);
  }

  modifyControl(event) {
    const {duration, from, angle, startAt} = this.state;
    event.preventDefault();
    this.props.animationControl.setProps({
      duration, from, angle, startAt
    });
    this.props.actions.updateAnimationControl(this.props.animationControl);
  }

  componentWillReceiveProps(nextProps) {
    const {animationControl, selectedGroup} = nextProps;
    if(animationControl && animationControl !== this.props.animationControl) {
      const {duration, from, angle, startAt, bodySeg} = animationControl;
      this.setState({duration, from, angle, startAt, target:bodySeg});
    } else if(selectedGroup && selectedGroup !== this.props.selectedGroup) {
      this.setState({groupItemId:null})
    }
  }

  decreaseAngle(event) {
    this.setState({
      angle:parseFloat(this.state.angle) - Math.PI/120
    });
    this.state.target.rotation.z = parseFloat(this.state.from) + parseFloat(this.state.angle) + Math.PI/120;
    event.preventDefault();
    return false;
  }

  increaseAngle(event) {
    this.setState({
      angle:parseFloat(this.state.angle) + Math.PI/120
    });
    this.state.target.rotation.z = parseFloat(this.state.from) + parseFloat(this.state.angle) + Math.PI/120;
    event.preventDefault();
    return false;
  }

  render() {
    const {animationControl, selectedGroup} = this.props;
    const controls = selectedGroup ? selectedGroup.getControls() : {};
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">
            Rotation
            {this.props.animationControl && <span className="text-muted"> ({this.props.animationControl.groupItem})</span>}
          </div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <form className="card-body--form" onSubmit={animationControl ? this.modifyControl : this.addControl}>
          {!animationControl && <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Segments</label>
            <div className="col-sm-7">
              <select className="custom-select" name="groupItemId" onChange={this.handleChange}>
                 <option selected>Choose...</option>
                 {controls && controls.bones && controls.bones.map(bone => <option key={bone.props.id} value={bone.props.id}>{bone.props.name}</option>)}
              </select>
            </div>
          </div>}
          {(this.state.groupItemId || animationControl)&& <div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-5 col-form-label">From</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" name="from" required={true} value={this.state.from} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-5 col-form-label">Angle</label>
              <div className="col-sm-7">
                <input type="text" name="angle" className="form-control" required={true} value={this.state.angle} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-5 col-form-label">Duration</label>
              <div className="col-sm-7">
                <input type="text" name="duration" className="form-control" required={true} value={this.state.duration} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-5 col-form-label">Start At</label>
              <div className="col-sm-7">
                <input type="text" name="startAt" className="form-control" required={true} value={this.state.startAt} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-4">
                <button type="submit" disabled={!this.state.groupItemId && !this.props.animationControl} className="btn btn-secondary">{animationControl ? "Modify" : "Submit"}</button>
              </div>
              <div className="col-sm-8 animation-form--actions">
                <button onClick={this.decreaseAngle} className="btn btn-secondary"><i className="fas fa-chevron-circle-left"></i></button>
                <button onClick={this.increaseAngle} className="btn btn-secondary"><i className="fas fa-chevron-circle-right"></i></button>
              </div>
            </div>
          </div>}
        </form>}
      </div>
    </div>;
  }

}

export default connect(
  state => ({
    selectedGroup:state.app.selectedGroup,
    animationControl:state.animation.selectedControl
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(RotateAnimationControlForm);
