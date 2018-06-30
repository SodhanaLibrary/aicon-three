import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';

class TranslateAnimationControlForm extends React.Component {
  constructor(props) {
    super(props);
    const {duration, pathItem, startAt} = this.props.animationControl ? this.props.animationControl : {};
    this.state = {
      groupId:null,
      pathItem:pathItem ? pathItem : '',
      duration:duration ? duration : 1,
      startAt:startAt ? startAt : 0,
      open:true,
      group:null
    };
    this.handleChange = this.handleChange.bind(this);
    this.addControl = this.addControl.bind(this);
    this.modifyControl = this.modifyControl.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.resetObjectPositon = this.resetObjectPositon.bind(this);
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
    event.preventDefault();
    const {duration, pathItem, startAt} = this.state;
    const translatePath = this.props.paths.find(path => path.props.id === pathItem);
    event.preventDefault();
    const frame = new window.animaticonObjects.TranslateAnimationControl3({
      duration,
      pathItem,
      group:this.props.selectedGroup,
      groupId:this.state.groupId,
      translatePath,
      startAt});
    frame.init();
    this.props.actions.addAnimationControl(frame);
    return false;
  }

  modifyControl(event) {
    const {duration, pathItem, startAt} = this.state;
    event.preventDefault();
    this.props.animationControl.setProps({
      duration, pathItem, startAt
    });
    this.props.actions.updateAnimationControl(this.props.animationControl);
  }

  componentWillReceiveProps(nextProps) {
    const {animationControl} = nextProps;
    if(animationControl && animationControl !== this.props.animationControl) {
      const {duration, pathItem, startAt} = animationControl;
      this.setState({duration, pathItem, startAt});
    }
  }

  resetObjectPositon() {
    this.props.animationControl.group.init();
    this.props.animationControl.initToStart();
    this.props.animationControl.group.updateProps();
  }

  render() {
    const {animaticonGroups, selectedGroup, animationControl} = this.props;
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">
            Translation
            {selectedGroup && <span className="text-muted"> ({selectedGroup.name})</span>}
          </div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <form className="card-body--form" onSubmit={animationControl ? this.modifyControl : this.addControl}>
          {animationControl && <span onClick={this.resetObjectPositon} className="btn btn-secondary btn-sm">Reset Object Position</span>}
          {!animationControl && <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Segments</label>
            <div className="col-sm-7">
              <select className="custom-select" name="groupId" onChange={this.handleChange}>
                 <option selected>Choose...</option>
                 {animaticonGroups && animaticonGroups.map(group => <option key={group.id} value={group.id}>{group.name} ({group.id})</option>)}
              </select>
            </div>
          </div>}
          {(this.state.groupId || animationControl) && <div>
            <div className="form-group row">
              <label className="col-sm-5 col-form-label">Translate Path</label>
              <div className="col-sm-7">
                <input type="text" name="pathItem" className="form-control form-control-sm" required={true} value={this.state.pathItem} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-5 col-form-label">Duration</label>
              <div className="col-sm-7">
                <input type="text" name="duration" className="form-control form-control-sm" required={true} value={this.state.duration} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-5 col-form-label">Start At</label>
              <div className="col-sm-7">
                <input type="text" name="startAt" className="form-control form-control-sm" required={true} value={this.state.startAt} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group">
              <button type="submit" disabled={!this.state.groupId && !animationControl} className="btn btn-secondary btn-sm">{animationControl ? "Modify" : "Submit"}</button>
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
    animationControl:state.animation.selectedControl,
    paths:state.app.paths
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(TranslateAnimationControlForm);
