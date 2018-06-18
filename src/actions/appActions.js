import actions from './actionTypes';

export const setSelectedGroup = selectedGroup => {
  return {
    type: actions.UPDATE_SELECTED_GROUP,
    selectedGroup
  }
}

export const setCurrentBanner = currentBanner => {
  return {
    type: actions.UPDATE_CURRENT_BANNER,
    currentBanner
  }
}

export const setSelectedPath = selectedPath => {
  return {
    type: actions.UPDATE_SELECTED_PATH,
    selectedPath
  }
}

export const setSelectedSegment = selectedSegment => {
  return {
    type: actions.UPDATE_SELECTED_SEGMENT,
    selectedSegment
  }
}

export const setMainScene = mainScene => {
  return {
    type: actions.UPDATE_MAIN_PAPER_SCOPE,
    mainScene
  }
}

export const addAnimaticonGroup = group => {
  return {
    type: actions.ADD_ANIMATICON_GROUP,
    group
  }
}

export const removeAnimaticonGroup = group => {
  return {
    type: actions.REMOVE_ANIMATICON_GROUP,
    group
  }
}

export const showHideShapesModal = show => {
  return {
    type: actions.SHOW_HIDE_SHAPES_MODAL,
    show
  }
}

export const addPath = path => {
  if(path) {
    return {
      type: actions.ADD_PATH,
      path
    }
  } else {
    return {};
  }
}

export const addPaths = paths => {
  if(paths) {
    return {
      type: actions.ADD_PATHS,
      paths
    }
  } else {
    return {};
  }
}

export const removePath = path => {
  return {
    type: actions.REMOVE_PATH,
    path
  }
}

export const removePaths = paths => {
  return {
    type: actions.REMOVE_PATHS,
    paths
  }
}

export const addBone = bone => {
  return {
    type: actions.ADD_BONE,
    bone
  }
}

export const addBones = bones => {
  return {
    type: actions.ADD_BONES,
    bones
  }
}

export const removeBone = bone => {
  return {
    type: actions.REMOVE_BONE,
    bone
  }
}

export const removeBones = bones => {
  return {
    type: actions.REMOVE_BONES,
    bones
  }
}

export const clearPaper = () => {
  return {
    type: actions.CLEAR_PAPER
  }
}

export const updateSize = (size) => {
  return {
    type: actions.UPDATE_SIZE,
    size
  }
}
