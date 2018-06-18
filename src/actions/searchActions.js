import actions from './actionTypes';

export const setObjectsSearchResults = searchResults => {
  return {
    type: actions.UPDATE_OBJECTS_SEARCH_RESULTS,
    searchResults
  }
}

export const setBannersSearchResults = searchResults => {
  return {
    type: actions.UPDATE_BANNERS_SEARCH_RESULTS,
    searchResults
  }
}
