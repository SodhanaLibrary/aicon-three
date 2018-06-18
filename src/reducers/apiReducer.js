import actions from '../actions/actionTypes';
import InitialState from './InitialState';

export default function apiReducer(state = InitialState.api, action) {
  if(action.type === actions.SET_API_RESPONSE) {
    return Object.assign({},state, {[action.endpoint.name]:action.endpoint.response});
  } else if(action.type === actions.CLEAR_API_RESPONSE) {
    return Object.assign({},state, {[action.endpoint.name]:null});
  } else {
    return state;
  }
}
