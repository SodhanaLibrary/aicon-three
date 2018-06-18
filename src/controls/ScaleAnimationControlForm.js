import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';

class ScaleAnimationControlForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupItemId:null,
      to:'1,1,1',
      duration:1,
      startAt:0,
      open:true
    };
    this.handleChange = this.handleChange.bind(this);
    this.addControl = this.addControl.bind(this);
    this.modifyControl = this.modifyControl.bind(this);
  }

  handleChange(event) {
    this.setState({
    [event.target.name]:  event.target.value
    });
    if(event.target.name === 'groupItemId') {
      const controls = this.props.selectedGroup ? this.props.selectedGroup.getControls() : {};
      const bone3 = controls.bones.find(bone => bone.props.id === event.target.value);
      if(bone3) {
        const scale = bone3.bone.scale;
        this.setState({to : scale.x +','+ scale.y +','+ scale.z});
      } else {
        this.setState({
        [event.target.name]: null
        });
      }
    }
  }

  addControl(event) {
    const {duration, to, startAt} = this.state;
    event.preventDefault();
    const frame = new window.animaticonObjects.ScaleAnimationControl3({
      duration,
      to,
      group:this.props.selectedGroup,
      groupItem:this.state.groupItemId,
      startAt});
    frame.init();
    this.props.actions.addAnimationControl(frame);
  }

  modifyControl(event) {
    const {duration, to, startAt} = this.state;
    event.preventDefault();
    this.props.animationControl.setProps({
      duration, to, startAt
    });
    this.props.actions.updateAnimationControl(this.props.animationControl);
  }

  componentWillReceiveProps(nextProps) {
    const {animationControl} = nextProps;
    if(animationControl && animationControl !== this.props.animationControl) {
      const {duration, to, startAt} = animationControl;
      this.setState({duration, to, startAt});
    }
  }

  render() {
    const {animationControl, selectedGroup} = this.props;
    const controls = selectedGroup ? selectedGroup.getControls() : {};
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">
            Scaling
            {animationControl && <span className="text-muted"> ({animationControl.groupItem})</span>}
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
            <label className="col-sm-5 col-form-label">To (X, Y, Z)</label>
            <div className="col-sm-7">
              <input type="text" name="to" className="form-control" required={true} value={this.state.to} onChange={this.handleChange}/>
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
          <div className="form-group">
            <button type="submit" disabled={!this.state.groupItemId && !this.props.animationControl} className="btn btn-secondary">{animationControl ? "Modify" : "Submit"}</button>
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
)(ScaleAnimationControlForm);
