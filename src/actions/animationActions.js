import actions from './actionTypes';

export const setSelectedAnimationControl = selectedAnimationControl => {
  return {
    type: actions.UPDATE_SELECTED_ANIMATION_CONTROL,
    selectedAnimationControl
  }
}

export const setAnimationCompleted = isAnimationCompleted => {
  return {
    type: actions.UPDATE_IS_ANIMATION_COMPLETED,
    isAnimationCompleted
  }
}

export const addAnimationControl = animationControl => {
  return {
    type: actions.ADD_ANIMATION_CONTROL,
    animationControl
  }
}

export const addAnimationControls = animationControls => {
  return {
    type: actions.ADD_ANIMATION_CONTROLS,
    animationControls
  }
}

export const removeAnimationControl = animationControl => {
  return {
    type: actions.REMOVE_ANIMATION_CONTROL,
    animationControl
  }
}

export const removeAllAnimationControls = () => {
  return {
    type: actions.REMOVE_ALL_ANIMATION_CONTROLS
  }
}

export const updateAnimationControl = animationControl => {
  return {
    type: actions.UPDATE_ANIMATION_CONTROL,
    animationControl
  }
}


export const showHideAnimationControlsSetModal = showAnimationControlsSetModal => {
  return {
    type: actions.SHOW_HIDE_ANIMATION_CONTROLS_SET_MODAL,
    showAnimationControlsSetModal
  }
}

export const setPreDefinedAnimationControlSets = endpoint => {
  return {
    type: actions.SET_PRE_DEFINED_ANIMATION_CONTROL_SETS,
    endpoint
  }
}

export const clearPreDefinedAnimationControlSets = animaticonObjName => {
  return {
    type: actions.CLEAR_PRE_DEFINED_ANIMATION_CONTROL_SETS,
    animaticonObjName
  }
}

export const setClock = clock => {
  return {
    type: actions.UPDATE_CLOCK,
    clock
  }
}
