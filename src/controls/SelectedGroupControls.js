import React from 'react';
import * as appActions from '../actions/appActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import RotateAnimationControlForm from './RotateAnimationControlForm';
import PreDefinedAnimationControlSets from './PreDefinedAnimationControlSets';
import ScaleAnimationControlForm from './ScaleAnimationControlForm';
import VisibilityAnimationControlForm from './VisibilityAnimationControlForm';
import TranslateAnimationControlForm from './TranslateAnimationControlForm';
import PathAnimationControlForm from './PathAnimationControlForm';

class SelectedGroupControls extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {selectedGroup, animationControl, selectedPath} = this.props;
    const controls = selectedGroup ? selectedGroup.getControls() : {};
    return <div>
        {selectedGroup && <PreDefinedAnimationControlSets/>}
        {(selectedGroup || (animationControl && animationControl.animationControlClass === 'RotateAnimationControl3')) && <RotateAnimationControlForm/>}
        {(selectedGroup || (animationControl && animationControl.animationControlClass === 'ScaleAnimationControl3')) && <ScaleAnimationControlForm/>}
        {(selectedGroup || (animationControl && animationControl.animationControlClass === 'VisibilityAnimationControl3')) && <VisibilityAnimationControlForm/>}
        {(selectedGroup || (animationControl && animationControl.animationControlClass === 'TranslateAnimationControl3')) && <TranslateAnimationControlForm/>}
        {(selectedPath || selectedGroup || (animationControl && animationControl.animationControlClass === 'PathAnimationControl3')) && <PathAnimationControlForm/>}
      </div>;
  }
}

export default connect(
  state => ({
    selectedGroup:state.app.selectedGroup,
    selectedPath:state.app.selectedPath,
    animationControl:state.animation.selectedControl
  }),
  dispatch => ({
    actions: bindActionCreators(appActions, dispatch)
  })
)(SelectedGroupControls);
