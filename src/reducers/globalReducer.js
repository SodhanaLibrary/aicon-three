import actions from '../actions/actionTypes';
import InitialState from './InitialState';

export default function apiReducer(state = InitialState.global, action) {
  if(action.type === actions.SHOW_HIDE_GLOBAL_MESSAGE_MODAL) {
    return Object.assign({},state, {showGlobalMessage:action.show});
  } else if(action.type === actions.UPDATE_GLOBAL_MESSAGE) {
    return Object.assign({},state, {globalMessage:action.message});
  } else if(action.type === actions.UPDATE_GLOBAL_MESSAGE_STATE) {
    return Object.assign({},state, {globalMessageState:action.state});
  } else if(action.type === actions.SHOW_HIDE_ANIMATICON_OBJ_MODAL) {
    return Object.assign({},state, {showAnimaticonObjSetsModal:action.show});
  } else if(action.type === actions.SHOW_HIDE_IMPORT_OBJ_MODAL) {
    return Object.assign({},state, {showImportObjModal:action.show});
  } else {
    return state;
  }
}
