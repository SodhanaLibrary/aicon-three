import actions from './actionTypes';

export const setApiResponse = endpoint => {
  return {
    type: actions.SET_API_RESPONSE,
    endpoint
  }
}

export const clearApiResponse = endpoint => {
  return {
    type: actions.CLEAR_API_RESPONSE,
    endpoint
  }
}
