class AnimaticonObj3 {
  constructor({animaticonObjName, name, tags, uuid, objJson, img, bones, paths,
                  groupId, scene, position={x:0, y:0, z:0}, scale={x:1, y:1, z:1}, rotation = {x:0, y:0, z:0}, visible = true}) {
      let rbones = bones;
      let rpaths = paths;
      this.scene = scene;
      if(!rbones && !rpaths) {
        const aObj = JSON.parse(objJson);
        rbones = aObj.bones;
        rpaths = aObj.paths;
        position = aObj.position || position;
        scale = aObj.scale || scale;
      }
      this.props = {
        position,
        scale,
        rotation,
        visible
      };
      this.groupId = groupId;
      this.animaticonObjName = animaticonObjName;
      this.name = name;
      this.tags = tags;
      this.uuid = uuid;
      this.img = img;
      this.id = -1;
      this.sbones = [];
      this.group = new THREE.Group();

      this.bones = rbones ? rbones.map((boneProps, index) => {
        boneProps.group = this.group;
        const bone3 = new window.animaticonObjects.Bone3(boneProps);
        this.sbones.push(bone3.bone);
        return bone3;
      }) : [];

      this.paths = rpaths ? rpaths.map((pathProps, index) => {
        pathProps.group = this.group;
        pathProps.scene = scene;
        return new window.animaticonObjects.PathObj3(pathProps);
      }) : [];

      this.bones.forEach((bone3) => {
        bone3.props.bones.forEach(boneId => {
          const b3 = this.bones.find(bone => bone.props.id === boneId);
          bone3.addBone(b3);
        });

        bone3.props.paths.forEach(pathId => {
          const p3 = this.paths.find(path => path.props.id === pathId);
          bone3.addPath(p3);
        });
      });

      const skeleton = new THREE.Skeleton(this.sbones);
      this.skeletonHelper = new THREE.SkeletonHelper( skeleton.bones[ 0 ] );
      this.skeletonHelper.skeleton = skeleton; // allow animation mixer to bind to SkeletonHelper directly
      this.group.add( skeleton.bones[0] );
      scene.add( this.skeletonHelper );
      scene.add( this.group);
      this.skeletonHelper.visible = false;
      this.init();
  }

  setId(id) {
    this.id = id;
  }

  setGroupId(groupId) {
    this.groupId = groupId;
  }

  init() {
    const {position, scale, visible, rotation} = this.props;
    this.bones.forEach(bone => {
      bone.init()});
    this.paths.forEach(path => {
        path.init()});

    this.group.position.x = position.x;
    this.group.position.y = position.y;
    this.group.position.z = position.z;

    this.group.scale.x = scale.x;
    this.group.scale.y = scale.y;
    this.group.scale.z = scale.z;

    this.group.rotation.x = rotation.x;
    this.group.rotation.y = rotation.y;
    this.group.rotation.z = rotation.z;

    this.group.visible = visible;
  }

  updateProps() {
    this.props.scale = {
      x:this.group.scale.x,
      y:this.group.scale.y,
      z:this.group.scale.z
    };
    this.props.position = {
      x:this.group.position.x,
      y:this.group.position.y,
      z:this.group.position.z
    };
  }

  setColors({fillColor, strokeColor}) {
    this.group.fillColor = fillColor;
    this.group.children.forEach(item => {
      if(item.strokeWidth > 1) {
        item.strokeColor = strokeColor;
      }
    });
  }

  remove() {
    if(this.group.parent) {
      this.group.parent.remove(this.skeletonHelper);
      this.group.parent.remove(this.group);
    }
  }

  addBone() {
    const boneProps = {
      id:"new One",
      name:"new One"
    }
    const bone3 = new window.animaticonObjects.Bone3(boneProps);
    this.bones.push(bone3);
    this.sbones.push(bone3.bone);

    this.scene.remove( this.skeletonHelper );
    this.scene.remove( this.group);

    this.group = new THREE.Group();
    const skeleton = new THREE.Skeleton(this.sbones);
    this.skeletonHelper = new THREE.SkeletonHelper( skeleton.bones[ 0 ] );
    this.skeletonHelper.skeleton = skeleton; // allow animation mixer to bind to SkeletonHelper directly
    this.group.add( skeleton.bones[0] );
    this.scene.add( this.skeletonHelper );
    this.scene.add( this.group);
    this.bones.forEach(bone => bone.init());

    this.formAllMusles();
    return bone3;
  }

  getAllMusles() {
    if(!this.allMusles) {
      this.formAllMusles();
    }
    return this.allMusles;
  }

  formAllMusles() {
    this.allMusles = this.bones.map(bone3 => bone3.muslePath).filter(musle => musle);
  }

  getProperties() {
    return {
      bones:this.bones.map(bone => bone.getProperties()),
      paths:this.paths.map(path => path.getProperties()),
      animaticonObjName:this.animaticonObjName,
      name:this.name,
      tags:this.tags,
      uuid:this.uuid,
      groupId:this.groupId,
      img:this.img,
      position:{
        x:this.group.position.x,
        y:this.group.position.y,
        z:this.group.position.z
      },
      scale:{
        x:this.group.scale.x,
        y:this.group.scale.y,
        z:this.group.scale.z
      }
    }
  }

  getControls() {
    return {
      bones:this.bones,
      animaticonObjName:this.animaticonObjName,
      name:this.name,
      tags:this.tags,
      uuid:this.uuid,
      img:this.img,
      groupId:this.groupId,
      position:{
        x:this.group.position.x,
        y:this.group.position.y,
        z:this.group.position.z
      },
      scale:{
        x:this.group.scale.x,
        y:this.group.scale.y,
        z:this.group.scale.z
      },
      visible:this.group.visible
    }
  }

}

window.animaticonObjects.AnimaticonObj3 = AnimaticonObj3;
