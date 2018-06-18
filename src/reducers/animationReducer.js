import actions from '../actions/actionTypes';
import InitialState from './InitialState';

let uuid = 1;
export default function animationReducer(state = InitialState.animation, action) {
  if(action.type === actions.UPDATE_SELECTED_ANIMATION_CONTROL) {
    return Object.assign({},state, {selectedControl:action.selectedAnimationControl});
  } else if(action.type === actions.UPDATE_IS_ANIMATION_COMPLETED) {
    return Object.assign({},state, {isAnimationCompleted:action.isAnimationCompleted});
  } else if(action.type === actions.ADD_ANIMATION_CONTROL) {
    const controls = state.controls.slice(0);
    action.animationControl.setId(uuid);
    uuid = uuid + 1;
    controls.push(action.animationControl);
    return Object.assign({},state, {controls});
  } else if(action.type === actions.ADD_ANIMATION_CONTROLS) {
    const controls = state.controls.slice(0);
    action.animationControls.forEach(cntrl => {
      cntrl.setId(uuid);
      controls.push(cntrl);
      uuid = uuid + 1;
    });
    return Object.assign({},state, {controls});
  } else if(action.type === actions.REMOVE_ANIMATION_CONTROL) {
    const controls = state.controls.filter(aControl => aControl.id !== action.animationControl.id);
    return Object.assign({},state, {controls, selectedControl:null});
  } else if(action.type === actions.REMOVE_ALL_ANIMATION_CONTROLS) {
    const controls = [];
    return Object.assign({},state, {controls, selectedControl:null});
  } else if(action.type === actions.UPDATE_ANIMATION_CONTROL) {
    const controls = state.controls.map(cntrl => cntrl.id === action.animationControl.id ? action.animationControl : cntrl);
    return Object.assign({},state, {controls});
  } else if(action.type === actions.SHOW_HIDE_ANIMATION_CONTROLS_SET_MODAL) {
    return Object.assign({},state, {showAnimationControlsSetModal:action.showAnimationControlsSetModal});
  } else if(action.type === actions.SET_PRE_DEFINED_ANIMATION_CONTROL_SETS) {
    const preDefinedAnimationControlSets = Object.assign({}, state.preDefinedAnimationControlSets, {[action.endpoint.animaticonObjName]:action.endpoint.animationControlSets});
    return Object.assign({},state, {preDefinedAnimationControlSets});
  } else if(action.type === actions.CLEAR_PRE_DEFINED_ANIMATION_CONTROL_SETS) {
    const preDefinedAnimationControlSets = Object.assign({}, state.preDefinedAnimationControlSets, {[action.animaticonObjName]:null});
    return Object.assign({},state, {preDefinedAnimationControlSets});
  } else if(action.type === actions.UPDATE_CLOCK) {
    return Object.assign({},state, {clock:action.clock});
  } else {
    return state;
  }
}
