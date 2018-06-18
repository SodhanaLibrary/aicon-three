class VisibilityAnimationControl3 {
  constructor({duration, visible, startAt, group, id, groupId}) {
    this.animationControlClass = 'VisibilityAnimationControl3';
    this.done = false;
    this.id = id;
    this.group = group;
    this.setProps({duration, visible, startAt});
    this.groupId = groupId;
  }

  setGroupId(groupId) {
    this.groupId = groupId;
  }

  setId(id) {
    this.id = id;
  }

  init() {
    this.group.group.visible = true;
  }

  setProps({duration, visible, startAt}) {
    this.duration = parseFloat(duration);
    this.visible = visible;
    this.startAt = startAt;
  }

  animate() {
    this.group.group.visible = this.visible;
    this.done = true;
  }

  setStartAt(sec) {
    this.startAt = sec;
  }

  getEndAt() {
    return this.startAt + this.duration;
  }

  getStartAt() {
    return this.startAt;
  }

  toJson() {
    return {
      duration:this.duration,
      visible:this.visible,
      startAt:this.startAt,
      animationControlClass:"VisibilityAnimationControl3",
      groupId:this.group.groupId
    };
  }
}

window.animaticonObjects.VisibilityAnimationControl3 = VisibilityAnimationControl3;
