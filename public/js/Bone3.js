class Bone3 {
  constructor({id, name, position = { x:0, y:100, z:0 }, length = 100, initAngle = 0, muscleWidth = {start:50, end:50}, joints = {
    start:{
      radius:-2,
      strokeColor:'black',
      strokeWidth:1
    },
    end:{
      radius:-2,
      strokeColor:'black',
      strokeWidth:1
    }
  },
  arc = {
    start:true,
    end:true
  }, bones = [], border = {strokeColor:'0xffffff', strokeWidth:1}, zIndex = 10, fillColor = '0x000000', paths = []}) {
      this.props = {
        id,
        position,
        name,
        muscleWidth,
        joints,
        border,
        zIndex,
        fillColor,
        bones,
        arc,
        initAngle,
        length,
        paths
      };
      this.bones = [];
      this.paths = [];
      this.bone = new THREE.Bone();
      this.setup();
  }

  init() {
    this.bone.rotation.z = this.props.initAngle;
    this.bone.position.y = this.props.position.y;
  }

  setPosition(position) {
    this.props.position = position;
    this.bone.position.x = position.x;
    this.bone.position.y = position.y;
    this.bone.position.z = position.z;
  }

  addBone(bone3) {
    if(bone3) {
      this.bones.push(bone3);
      bone3.setPosition({
        x:0,
        y:this.props.length,
        z:0
      });
      this.bone.add(bone3.bone);
    }
  }

  addPath(path3) {
    if(path3 && !this.paths.find(path => path.props.id === path3.props.id)) {
      this.paths.push(path3);
      // path3.setPosition({
      //   x:0,
      //   y:this.props.length,
      //   z:0
      // });
      this.bone.add(path3.path);
    }
  }

  removeBone(bone3) {
    this.bone.remove(bone3.bone);
  }

  setAngle(angle) {
    this.bone.rotation.z = angle;
  }

  setup() {
    this.formMusles();
  }

  formMusles() {
    this.makeMuslePoints();
  }

  getProperties() {
    this.props = Object.assign({}, this.props, {bones:this.bones.map(bone3 => bone3.props.id), paths:this.paths.map(path3 => path3.props.id)});
    return this.props;
  }

  setProps(props) {
    this.props = Object.assign({}, this.props, props);
    this.bones.forEach(bone3 => {
      bone3.setPosition({
        x:0,
        y:this.props.length,
        z:0
      });
    });

    this.paths.forEach(path3 => {
      path3.setPosition({
        x:0,
        y:this.props.length,
        z:0
      });
    });
    this.makeMuslePoints();
    this.formzIndexes();
    this.init();
  }

  setGroup(group) {
    this.group = group;
    this.group.add(this.bone);
    this.bone.rotation.z = this.initAngle;
  }

  makeMuslePoints() {
    const {muscleWidth, length, fillColor, arc, zIndex, border} = this.props;
    if(this.muslePath) {
      this.bone.remove(this.muslePath);
      this.bone.remove(this.musleBorderPath);
    }

    if(muscleWidth.start === 0 || muscleWidth.end === 0) {
      this.muslePath = null;
      this.musleBorderPath = null;
      return;
    }

    const trackShape = new THREE.Shape();
    trackShape.moveTo( - muscleWidth.start / 2, 0);
    trackShape.lineTo( - muscleWidth.end / 2, length);
    if(arc.start) {
      trackShape.absarc( 0, length, muscleWidth.end / 2, Math.PI, 0, true );
    } else {
      trackShape.lineTo( muscleWidth.end / 2, length);
    }
    trackShape.lineTo( muscleWidth.start / 2, 0);
    if(arc.end) {
      trackShape.absarc( 0, 0, muscleWidth.start / 2, 2 * Math.PI, Math.PI, true );
    } else {
      trackShape.lineTo( muscleWidth.start / 2, 0);
    }
    trackShape.autoClose = true;
    const geometry = new THREE.ShapeGeometry( trackShape);
    const material = new THREE.MeshBasicMaterial( {
      color: parseInt(fillColor)
    });

    const borderShape = new THREE.Shape();
    borderShape.moveTo( - (muscleWidth.start + 1) / 2, 0);
    borderShape.lineTo( - (muscleWidth.end + 1) / 2, length);
    if(arc.start) {
      borderShape.absarc( 0, length, (muscleWidth.end + 1) / 2, Math.PI, 0, true );
    } else {
      borderShape.lineTo( (muscleWidth.end + 1) / 2, length);
    }
    borderShape.lineTo( (muscleWidth.start + 1) / 2, 0);
    if(arc.end) {
      borderShape.absarc( 0, 0, (muscleWidth.start + 1) / 2, 2 * Math.PI, Math.PI, true );
    } else {
      borderShape.lineTo( (muscleWidth.start + 1) / 2, 0);
    }
    borderShape.autoClose = true;
    const borderGeometry = new THREE.ShapeGeometry( borderShape);
    const borderMaterial = new THREE.MeshBasicMaterial( {
      color: parseInt(border.strokeColor)
    });
    this.muslePath = new THREE.Mesh(geometry, material);
    this.musleBorderPath = new THREE.Mesh(borderGeometry, borderMaterial);

    this.bone.add(this.muslePath);
    this.bone.add(this.musleBorderPath);

    this.formzIndexes();
  }

  formzIndexes() {
    const {zIndex} = this.props;
    if(this.muslePath) {
       this.musleBorderPath.position.z = zIndex - 0.5;
       this.muslePath.position.z = zIndex - 0.1;
    }
  }

  getAngle() {
    return this.bone.rotation.z;
  }

  getLength() {
    return this.props.length;
  }

  rotate(angle) {
    this.bone.rotation.z = angle;
  }

}

window.animaticonObjects.Bone3 = Bone3;
