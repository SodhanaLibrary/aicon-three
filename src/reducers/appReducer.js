import actions from '../actions/actionTypes';
import InitialState from './InitialState';

let uuid = 1;
export default function appReducer(state = InitialState.app, action) {
  if(action.type === actions.UPDATE_SELECTED_GROUP) {
    return Object.assign({},state, {selectedGroup:action.selectedGroup, selectedPath:null, selectedSegment:null});
  } else if(action.type === actions.UPDATE_CURRENT_BANNER) {
    return Object.assign({},state, {currentBanner:action.currentBanner});
  } else if(action.type === actions.UPDATE_SELECTED_PATH) {
    return Object.assign({},state, {selectedPath:action.selectedPath, selectedGroup:null});
  } else if(action.type === actions.UPDATE_SELECTED_SEGMENT) {
    return Object.assign({},state, {selectedSegment:action.selectedSegment, selectedGroup:null});
  } else if(action.type === actions.ADD_ANIMATICON_GROUP) {
    const animaticonGroups = state.animaticonGroups.slice(0);
    action.group.setId(uuid);
    uuid = uuid + 1;
    animaticonGroups.push(action.group);
    return Object.assign({},state, {animaticonGroups});
  } else if(action.type === actions.REMOVE_ANIMATICON_GROUP) {
    const animaticonGroups = state.animaticonGroups.filter(grp => grp.id !== action.group.id);
    return Object.assign({},state, {animaticonGroups});
  } else if(action.type === actions.ADD_PATH) {
    const paths = state.paths.slice(0);
    paths.push(action.path);
    return Object.assign({},state, {paths});
  } else if(action.type === actions.ADD_PATHS) {
    const paths = state.paths.concat(action.paths);
    return Object.assign({},state, {paths});
  } else if(action.type === actions.REMOVE_PATH) {
    const paths = state.paths.filter(path => path !== action.path);
    return Object.assign({},state, {paths});
  } else if(action.type === actions.REMOVE_PATHS) {
    const paths = state.paths.filter(path => action.paths.indexOf(path) === -1);
    return Object.assign({},state, {paths});
  } else if(action.type === actions.ADD_BONE) {
    const bones = state.bones.slice(0);
    bones.push(action.bone);
    return Object.assign({}, state, {bones});
  } else if(action.type === actions.ADD_BONES) {
    const bones = state.bones.concat(action.bones);
    return Object.assign({}, state, {bones});
  } else if(action.type === actions.REMOVE_BONE) {
    const bones = state.bones.filter(bone => bone !== action.bone);
    return Object.assign({},state, {bones});
  } else if(action.type === actions.REMOVE_BONES) {
    const bones = state.bones.filter(bone => action.bones.indexOf(bone) === -1);
    return Object.assign({},state, {bones});
  } else if(action.type === actions.UPDATE_MAIN_PAPER_SCOPE) {
    return Object.assign({},state, {mainScene:action.mainScene});
  } else if(action.type === actions.SHOW_HIDE_SHAPES_MODAL) {
    return Object.assign({},state, {showShapesModal:action.show});
  } else if(action.type === actions.CLEAR_PAPER) {
    return Object.assign({},state, {
      selectedGroup:null,
      currentBanner:null,
      selectedPath:null,
      selectedSegment:null,
      animaticonGroups:[],
      paths:[],
      bones:[]
    });
  } else if(action.type === actions.UPDATE_SIZE) {
    return Object.assign({},state, {size:action.size});
  } else {
    return state;
  }
}
