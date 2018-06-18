import actions from '../actions/actionTypes';
import InitialState from './InitialState';

export default function apiReducer(state = InitialState.search, action) {
  if(action.type === actions.UPDATE_OBJECTS_SEARCH_RESULTS) {
    return Object.assign({},state, {objectsSearchResults:action.searchResults});
  } else if(action.type === actions.UPDATE_BANNERS_SEARCH_RESULTS) {
    return Object.assign({},state, {bannersSearchResults:action.searchResults});
  } else {
    return state;
  }
}
