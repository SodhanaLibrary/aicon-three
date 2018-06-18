class RotateAnimationControl3 {
  constructor({duration, from, angle, startAt, group, groupItem, id, groupId}) {
    this.animationControlClass = 'RotateAnimationControl3';
    this.done = false;
    this.rotatedAngle = 0;
    this.id = id;
    this.group = group;
    this.groupItem = groupItem;
    this.bodySeg = this.group.bones.find(bone => bone.props.id === this.groupItem).bone;
    this.setProps({duration, from, angle, startAt});
    this.groupId = groupId;
    this.onComplete = this.onComplete.bind(this);
  }

  setId(id) {
    this.id = id;
  }

  setGroupId(groupId) {
    this.groupId = groupId;
  }

  init() {
    this.bodySeg.rotation.z = this.from;
    this.done = false;
    this.rotatedAngle = 0;
    this.started = false;
  }

  setProps({duration, from, angle, startAt}) {
    this.duration = parseFloat(duration);
    this.from = parseFloat(from);
    this.angle = parseFloat(angle);
    this.to = this.angle/(this.duration * 60);
    this.startAt = parseFloat(startAt);
  }

  animate() {
    if(!this.started) {
      this.init();
      this.started = true;
      if(!this.tween) {
        this.tween = window.animaticonObjects.AnimaticonUtils.animateVector3(this.bodySeg.rotation, {z:this.from + this.angle}, {
          duration:this.duration*1000,
          callback:this.onComplete
        });
      }
      this.tween.start();
    }
  }

  onComplete() {
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
      from:this.from,
      angle:this.angle,
      startAt:this.startAt,
      animationControlClass:"RotateAnimationControl3",
      groupItem:this.groupItem,
      groupId:this.group.groupId
    };
  }

  toRadians(angle) {
    return angle * (Math.PI / 180);
  }
}

window.animaticonObjects.RotateAnimationControl3 = RotateAnimationControl3;
