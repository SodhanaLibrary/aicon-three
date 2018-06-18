import actions from './actionTypes';

export const showHideGlobalMessageModal = show => {
  return {
    type: actions.SHOW_HIDE_GLOBAL_MESSAGE_MODAL,
    show
  }
}

export const showHideAnimaticonObjSetsModal = show => {
  return {
    type: actions.SHOW_HIDE_ANIMATICON_OBJ_MODAL,
    show
  }
}

export const showHideImportObjModal = show => {
  return {
    type: actions.SHOW_HIDE_IMPORT_OBJ_MODAL,
    show
  }
}

export const updateGlobalMessageState = state => {
  return {
    type: actions.UPDATE_GLOBAL_MESSAGE_STATE,
    state
  }
}

export const updateGlobalMessage = message => {
  return {
    type: actions.UPDATE_GLOBAL_MESSAGE,
    message
  }
}
