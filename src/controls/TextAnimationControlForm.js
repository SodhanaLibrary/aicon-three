import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';

class TextAnimationControlForm extends React.Component {
  constructor(props) {
    super(props);
    const {animationControl} = this.props;
    this.state = {
      pathItemId:null,
      fromPath:animationControl ? animationControl.fromPath : '',
      toPath:animationControl ? animationControl.toPath : '',
      duration:animationControl ? animationControl.duration : 1,
      startAt:animationControl ? animationControl.startAt : 0,
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
    if(event.target.name === 'pathItemId') {
      const controls = this.props.selectedGroup ? this.props.selectedGroup.getControls() : {};
      const path = controls.paths.find(path => path.props.id === event.target.value);
      if(path) {
        this.setState({fromPath : path.path.pathData});
      } else {
        this.setState({
        [event.target.name]: null
        });
      }
    }
  }

  addControl(event) {
    const {duration, fromPath, toPath, startAt} = this.state;
    const {selectedPath, mainScene} = this.props;
    const group = this.props.animaticonGroups.find(agroup => selectedPath.group._id === agroup.group._id);
    event.preventDefault();
    const frame = new window.animaticonObjects.PathAnimationControl({
      duration,
      fromPath,
      group,
      toPath:selectedPath.path.pathData,
      pathId:this.props.selectedPath ? this.props.selectedPath.props.id : this.state.pathItemId,
      scope:mainScene,
      startAt});
    frame.init();
    this.props.actions.addAnimationControl(frame);
  }

  modifyControl(event) {
    const {duration, fromPath, toPath, startAt} = this.state;
    event.preventDefault();
    this.props.animationControl.setProps({
      duration, fromPath, toPath, startAt
    });
    this.props.actions.updateAnimationControl(this.props.animationControl);
  }

  copyPathData(name) {
    this.setState({
      [name]:this.props.selectedPath.path.pathData
    });
  }

  componentWillReceiveProps(nextProps) {
    const {animationControl, selectedPath} = nextProps;
    if(animationControl && animationControl !== this.props.animationControl) {
      const {duration, fromPath, toPath, startAt} = animationControl;
      this.setState({duration, fromPath, toPath, startAt});
    }
  }

  render() {
    const {animationControl, selectedGroup, selectedPath} = this.props;
    const controls = selectedGroup ? selectedGroup.getControls() : {};
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">
            Path Animation
            {animationControl && <span className="text-muted"> ({animationControl.groupItem})</span>}
          </div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <form className="card-body--form" onSubmit={animationControl ? this.modifyControl : this.addControl}>
          {!animationControl && !selectedPath && <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Segments</label>
            <div className="col-sm-7">
              <select className="custom-select" name="pathItemId" onChange={this.handleChange}>
                 <option selected>Choose...</option>
                 {controls && controls.paths && controls.paths.map(path => <option key={path.props.id} value={path.props.id}>{path.props.name}</option>)}
              </select>
            </div>
          </div>}
          {(this.state.pathItemId || selectedPath || animationControl)&& <div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">From Path</label>
            <div className="col-sm-5">
              <input type="text" className="form-control form-control-sm" name="fromPath" required={true} value={this.state.fromPath} onChange={this.handleChange}/>
            </div>
            <div className="col-sm-2">
              {selectedPath && <a href="#" title="Export" className={classNames("btn btn-primary btn-sm", {disabled:!this.props.selectedPath})} onClick={() => this.copyPathData('fromPath')} role="button" aria-pressed="true"><i className="fas fa-external-link-square-alt"></i></a>}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">To Path</label>
            <div className="col-sm-5">
              <input type="text" name="toPath" className="form-control form-control-sm" required={true} value={this.state.toPath} onChange={this.handleChange}/>
            </div>
            <div className="col-sm-2">
              {selectedPath && <a href="#" title="Export" className={classNames("btn btn-primary btn-sm", {disabled:!this.props.selectedPath})} onClick={() => this.copyPathData('toPath')} role="button" aria-pressed="true"><i className="fas fa-external-link-square-alt"></i></a>}
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
            <button type="submit" disabled={!selectedPath && !this.state.pathItemId && !animationControl} className="btn btn-secondary btn-sm">{animationControl ? "Modify" : "Submit"}</button>
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
    selectedPath:state.app.selectedPath,
    animationControl:state.animation.selectedControl,
    mainScene:state.app.mainScene
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(TextAnimationControlForm);
