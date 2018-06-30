class ScaleAnimationControl3 {
  constructor({duration, to, startAt, group, groupItem, id, groupId}) {
    this.animationControlClass = 'ScaleAnimationControl3';
    this.done = false;
    this.scaledLength = 0;
    this.id = id;
    this.group = group;
    this.groupItem = groupItem;
    this.setProps({duration, to, startAt});
    this.bodySeg = this.group.bones.find(bone => bone.props.id === this.groupItem).bone;
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
    this.done = false;
    this.scaledLength = 0;
    this.started = false;
    if(this.initScale) {
      this.bodySeg.scale.x = this.initScale.x;
      this.bodySeg.scale.y = this.initScale.y;
      this.bodySeg.scale.z = this.initScale.z;
    }
  }

  setProps({duration, to, startAt}) {
    this.duration = parseFloat(duration);
    this.to = to;
    const cord = to.split(',');
    this.scaleTo = {
      x:parseFloat(cord[0]),
      y:parseFloat(cord[1]),
      z:parseFloat(cord[2])
    };
    this.startAt = parseFloat(startAt);
  }

  animate() {
    if(!this.started) {
      this.init();
      this.started = true;
      if(!this.tween) {
        this.initScale = this.bodySeg.scale.clone();
        this.tween = window.animaticonObjects.AnimaticonUtils.animateVector3(this.bodySeg.scale, this.scaleTo, {
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
      to:this.to,
      startAt:this.startAt,
      animationControlClass:"ScaleAnimationControl3",
      groupItem:this.groupItem,
      groupId:this.group.groupId
    };
  }
}

window.animaticonObjects.ScaleAnimationControl3 = ScaleAnimationControl3;
