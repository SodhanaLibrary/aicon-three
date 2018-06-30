import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CommonSVG from '../common/CommonSVG';
import config from '../../config/appConfig';
import classNames from 'classnames';
import AnimationControlsSetModal from './AnimationControlsSetModal';

class AnimationPanel extends React.Component{
  constructor(props){
    super(props);
    this.isMouseDown = false;
    this.selectAnimationControl = this.selectAnimationControl.bind(this);
    this.removeAnimationControl = this.removeAnimationControl.bind(this);
    this.removeAllAnimationControls = this.removeAllAnimationControls.bind(this);
    this.onAnControlDrag = this.onAnControlDrag.bind(this);
    this.playAnimations = this.playAnimations.bind(this);
    this.reset = this.reset.bind(this);
    this.saveAnimationControls = this.saveAnimationControls.bind(this);
  }

  onAnControlDrag(event) {
    if(this.isMouseDown && this.props.selectedAnimationControl) {
      this.props.selectedAnimationControl.setStartAt(Math.max((event.screenX - this.animationPanel.offsetLeft - (this.props.selectedAnimationControl.duration * 40)/2), 0)/ 40);
      this.props.actions.updateAnimationControl(this.props.selectedAnimationControl);
      this.props.actions.setSelectedAnimationControl(null);
      this.props.actions.setSelectedAnimationControl(this.props.selectedAnimationControl);
    }
  }

  removeAnimationControl() {
    if(this.props.selectedAnimationControl) {
      this.props.actions.removeAnimationControl(this.props.selectedAnimationControl);
    }
  }

  removeAllAnimationControls() {
    this.props.actions.removeAllAnimationControls();
    let groups = this.props.animationControls.map(ac => ac.group);
    groups = groups.filter((group, ind) => group && groups.indexOf(group) === ind);
    groups.forEach(group => {
      group.init();
    });
  }

  selectAnimationControl(fr) {
    this.props.actions.setSelectedAnimationControl(fr);
    this.props.actions.setSelectedGroup(null);
    this.isMouseDown = true;
  }

  playAnimations() {
    let groups = this.props.animationControls.map(ac => ac.group);
    groups = groups.filter((group, index) => group && groups.indexOf(group) === index);
    groups.forEach(group => group.init());
    this.props.animationControls.forEach(cntrl => cntrl.init(true));
    this.props.actions.setAnimationCompleted(false);
    this.props.clock.start();
  }

  reset() {
    this.props.animaticonGroups.forEach(group => group.init());
  }

  saveAnimationControls() {
    this.props.actions.showHideAnimationControlsSetModal(true);
  }

  render() {
    const {animationControls, selectedAnimationControl, isAnimationCompleted} = this.props;
    return <div>
         <div className="body_content--timeline-wrapper">
           <div style={{
             height:animationControls.length * 40
           }} className="body_content--timeline"
                 id="animation_timeline"
                 ref={ref => this.animationPanel = ref}
                 onMouseLeave={() => this.isMouseDown = false}
                 onMouseUp={() => this.isMouseDown = false}
                 onMouseMove={this.onAnControlDrag}>
                {animationControls.map((fr, i) => {
                  return <div key={fr.id} style={{
                    top:(i * 35)+"px",
                    width:(fr.duration * 40)+"px",
                    left:(fr.startAt * 40)+"px"
                  }}
                  onMouseDown={() => this.selectAnimationControl(fr)}
                  className={classNames("anmation_frame_obj", {"anmation_frame_obj--selected":selectedAnimationControl && fr.id === selectedAnimationControl.id})}>
                  {fr.id}
                  </div>
                })}
         </div>
       </div>
    <div className="body_content--timeline__buttons">
      <a href="#" onClick={this.playAnimations} className={classNames("btn btn-primary btn-sm active", {
        "disabled":this.props.animationControls.length === 0
      })}  role="button" aria-pressed="true">{isAnimationCompleted ? "Play" : "Pause"}</a>
      <a href="#" onClick={this.reset} className={classNames("btn btn-primary btn-sm active", {
        "disabled":this.props.animationControls.length === 0
      })}  role="button" aria-pressed="true">Reset</a>
      <a href="#" onClick={this.removeAnimationControl} className={classNames("btn btn-primary btn-sm active", {
        "disabled":(!selectedAnimationControl)
      })}  role="button" aria-pressed="true">Delete</a>
      <a href="#" onClick={this.removeAllAnimationControls} className={classNames("btn btn-primary btn-sm active", {
        "disabled":animationControls.length === 0
      })}  role="button" aria-pressed="true">Delete All</a>
      <a href="#" onClick={this.saveAnimationControls} className={classNames("btn btn-primary btn-sm active", {
        "disabled":this.props.animationControls.length === 0
      })}  role="button" aria-pressed="true">Save as predefined</a>
    </div>
    <AnimationControlsSetModal/>
    </div>;
  }
}

export default connect(
  state => ({
    selectedGroup:state.app.selectedGroup,
    animaticonGroups:state.app.animaticonGroups,
    isAnimationCompleted:state.animation.isAnimationCompleted,
    animationControls:state.animation.controls,
    selectedAnimationControl:state.animation.selectedControl,
    clock:state.animation.clock
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(AnimationPanel);
