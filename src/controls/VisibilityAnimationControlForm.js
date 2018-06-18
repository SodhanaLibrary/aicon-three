import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';

class VisibilityAnimationControlForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId:null,
      visible:true,
      duration:0.1,
      startAt:0,
      open:true,
      group:null
    };
    this.handleChange = this.handleChange.bind(this);
    this.addControl = this.addControl.bind(this);
    this.modifyControl = this.modifyControl.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleCheckboxChange(event) {
    this.setState({
     [event.target.name]: event.target.checked
    });
  }

  handleChange(event) {
    this.setState({
    [event.target.name]:  event.target.value
    });
    if(event.target.name === 'groupId') {
      const groups = this.props.animaticonGroups || [];
      const group = groups.find(group => group.id == event.target.value);
      if(group) {
        this.setState({group});
      } else {
        this.setState({
        [event.target.name]: null
        });
      }
    }
  }

  addControl(event) {
    const {duration, visible, startAt} = this.state;
    event.preventDefault();
    const frame = new window.animaticonObjects.VisibilityAnimationControl3({
      duration,
      visible,
      group:this.props.selectedGroup,
      groupId:this.state.groupId,
      startAt});
    frame.init();
    this.props.actions.addAnimationControl(frame);
  }

  modifyControl(event) {
    const {duration, visible, startAt} = this.state;
    event.preventDefault();
    this.props.animationControl.setProps({
      duration, visible, startAt
    });
    this.props.actions.updateAnimationControl(this.props.animationControl);
  }

  componentWillReceiveProps(nextProps) {
    const {animationControl} = nextProps;
    if(animationControl && animationControl !== this.props.animationControl) {
      const {duration, visible, startAt} = animationControl;
      this.setState({duration, visible, startAt});
    }
  }

  render() {
    const {animaticonGroups, selectedGroup, animationControl} = this.props;
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">
            Visibility
            {selectedGroup && <span className="text-muted"> ({selectedGroup.name})</span>}
          </div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <form className="card-body--form" onSubmit={animationControl ? this.modifyControl : this.addControl}>
          {!animationControl && <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Segments</label>
            <div className="col-sm-7">
              <select className="custom-select" name="groupId" onChange={this.handleChange}>
                 <option selected>Choose...</option>
                 {animaticonGroups && animaticonGroups.map(group => <option key={group.id} value={group.id}>{group.name} ({group.id})</option>)}
              </select>
            </div>
          </div>}
          {this.state.groupId && <div>
            <div className="form-group row">
              <label className="col-sm-5 col-form-label">Visibility</label>
              <div className="col-sm-7">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" onChange={this.handleCheckboxChange} name="visible" checked={this.state.visible}/>
                  <label className="form-check-label">Visible</label>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-5 col-form-label">Start At</label>
              <div className="col-sm-7">
                <input type="text" name="startAt" className="form-control" required={true} value={this.state.startAt} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group">
              <button type="submit" disabled={!this.state.groupId && !animationControl} className="btn btn-secondary">{animationControl ? "Modify" : "Submit"}</button>
            </div>
          </div>}
        </form>}
      </div>
    </div>;
  }

}

export default connect(
  state => ({
    animaticonGroups:state.app.animaticonGroups,
    selectedGroup:state.app.selectedGroup,
    animationControl:state.animation.selectedControl
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(VisibilityAnimationControlForm);
