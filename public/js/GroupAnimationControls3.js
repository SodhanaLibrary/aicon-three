class GroupAnimationControls3 {
  constructor({duration = 1, startAt = 0, id, group}) {
    this.animationControlClass = 'GroupAnimationControls3';
    this.id = id;
    this.controls = [];
    this.startAt = startAt;
    this.group = group;
    this.setProps({duration, startAt});
  }

  setControls(controls) {
    this.controls = controls;
    let start = Number.MAX_VALUE;
    let end = 0;
    this.controls.forEach(cnt => {
      start = start > cnt.startAt ? cnt.startAt : start;
      end = end < (cnt.startAt + cnt.duration)? (cnt.startAt + cnt.duration) : end;
    });
    this.startAt = start;
    this.end = end;
    this.duration = this.end - this.startAt;
  }

  setId(id) {
    this.id = id;
  }

  init() {
    this.done = false;
    this.started = false;
    this.controls.forEach(cnt => cnt.init());
  }

  setProps({duration, startAt}) {
    this.duration = parseFloat(duration);
    this.setStartAt(startAt);
  }

  animate(relativeTime) {
    if(!this.started) {
      this.init();
      this.started = true;
    }
    if(!this.done) {
      let done = true;
      this.controls.forEach(fr => {
        if(relativeTime > fr.startAt) {
          fr.animate(relativeTime);
        }
        done = done && fr.done;
      });
      this.done = done;
    }
  }

  setStartAt(sec) {
    const diff = sec - this.startAt;
    this.startAt = sec;
    this.controls.forEach(cnt => {
      cnt.setStartAt(parseFloat(cnt.startAt) + diff);
    });
    this.end = this.startAt + this.duration;
  }

  getEndAt() {
    return this.startAt + this.duration;
  }

  getStartAt() {
    return this.startAt + this.duration;
  }

  toJson() {
    return {
      duration:this.duration,
      startAt:this.startAt,
      animationControlClass:"GroupAnimationControls3",
      controls:this.controls.map(cnt => cnt.toJson())
    };
  }
}

window.animaticonObjects.GroupAnimationControls3 = GroupAnimationControls3;
