class TranslateAnimationControl3 {
  constructor({duration, pathItem, startAt, group, id, translatePath, groupId}) {
    this.animationControlClass = 'TranslateAnimationControl3';
    this.done = false;
    this.translatePath = translatePath;
    this.id = id;
    this.group = group;
    if(!translatePath) {
      this.translatePath = this.group.paths.find(path => path.props.id === pathItem);
    }
    this.setProps({duration, pathItem, startAt});
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
    this.started = false;
    this.initToStart();
  }

  initToStart() {
    const p = this.translatePath.getPointAt(0);
    this.group.group.position.x = p.x;
    this.group.group.position.y = p.y;
  }

  setProps({duration, pathItem, startAt}) {
    this.duration = parseFloat(duration);
    this.pathItem = pathItem;
    this.startAt = parseFloat(startAt);
  }

  animate() {
    if(!this.done && !this.started) {
      this.init();
      this.started = true;
      const point = this.translatePath.getPointAt(1);
      this.tween = window.animaticonObjects.AnimaticonUtils.animateVector3(this.group.group.position, {x:point.x, y:point.y}, {
        duration:this.duration*1000,
        callback:this.onComplete
      });
      this.tween.start();
    } else {
      this.group.group.position.needUpdate = true;
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
      startAt:this.startAt,
      animationControlClass:"TranslateAnimationControl3",
      pathItem:this.pathItem,
      groupId:this.group.groupId
    };
  }
}

window.animaticonObjects.TranslateAnimationControl3 = TranslateAnimationControl3;
