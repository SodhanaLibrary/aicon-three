class PathAnimationControl3 {
  constructor({duration, toPath, startAt, id, pathId, group, groupId}) {
    this.animationControlClass = 'PathAnimationControl3';
    this.done = false;
    this.id = id;
    this.group = group;
    if(group && group.paths) {
      this.scene = group.scene;
      this.bodySeg = group.paths.find(path => path.props.id === pathId);
    }
    this.setProps({duration, toPath, startAt, pathId});
    this.groupId = groupId;
    this.onComplete = this.onComplete.bind(this);
  }

  setId(id) {
    this.id = id;
  }

  setGroupId(groupId) {
    this.groupId = groupId;
  }

  init(start) {
    if(this.bodySeg && this.bodySeg.props.type === 'custom-geometry') {
      this.bodySeg.path.geometry.vertices.forEach((v, index) => {
        const p = this.bodySeg.props.pathData.vertices[index];
        v.set(p.x, p.y, p.z);
      });
      this.done = start ? true : false;
      this.started = false;
      this.count = 0;
    }
  }

  setProps({duration, toPath, startAt, pathId}) {
    if(this.bodySeg && this.bodySeg.props.type === 'custom-geometry') {
      this.duration = parseFloat(duration);
      this.toPath = toPath;
      this.startAt = parseFloat(startAt);
      this.pathId = pathId;

      const pathData = JSON.parse(toPath);

      const geometry = new THREE.ParametricGeometry((u, v, target) => {
          var x = u * pathData.height;
          var z = 0;
          var y = v * pathData.width;
          target.set(x, y, z);
      }, 1, pathData.segments);
      geometry.vertices.forEach((v, index) => {
        const p = pathData.vertices[index];
        v.set(p.x, p.y, p.z);
      });
      if(this.bodySeg) {

      }
      this.bodySeg.path.geometry.morphTargets[0] = {name: 't1', vertices: geometry.vertices};
      this.bodySeg.path.geometry.computeMorphNormals();
      this.bodySeg.path.updateMorphTargets();
    }
  }

  animate() {
    if(this.bodySeg && !this.started) {
      this.init();
      this.started = true;
      this.bodySeg.path.geometry.vertices.forEach((vert, index) => {
        const tween = window.animaticonObjects.AnimaticonUtils.animateVector3(this.bodySeg.path.geometry.vertices[index], this.bodySeg.path.geometry.morphTargets[0].vertices[index], {
          duration:this.duration*1000,
          callback:this.onComplete
        });
        tween.start();
      });
    } else {
      this.bodySeg.path.geometry.verticesNeedUpdate = true;
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
      animationControlClass:"PathAnimationControl3",
      toPath:this.toPath,
      pathId:this.pathId,
      groupId:this.group ? this.group.groupId : null
    };
  }
}

window.animaticonObjects.PathAnimationControl3 = PathAnimationControl3;
