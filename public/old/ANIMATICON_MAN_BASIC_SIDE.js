class ANIMATICON_MAN_BASIC_SIDE {
  constructor(bns, scope) {
      let bones = bns;
      this.bones = [];
      this.paths = [];
      this.scope = scope ? scope : paper;
      this.group = new this.scope.Group();
      if(!bones) {
        this.getHumanBones();
      }
      this.animaticonObjName = "ANIMATICON_MAN_BASIC_SIDE";
      this.id = -1;
      this.alignAsPerZindex();
  }

  setId(id) {
    this.id = id;
  }

  init() {
    this.bones.forEach(bone => {
      bone.init()});
    this.alignAsPerZindex();
  }

  alignAsPerZindex() {
    const children = this.group.children;
    children.sort((a, b) => a.zIndex - b.zIndex);
  }

  getControls() {
    return {
      bones:this.bones,
      paths:this.paths
    }
  }

  getHumanBones() {

    const backBone = new Bone({
        id:"backBone",
        start:new this.scope.Point(255, 290),
        end:new this.scope.Point(255, 87),
        muscleWidth:{start:40, end:40},
        joints:{
          start:{
            radius:-2,
            strokeColor:'black'
          },
          end:{
            radius:-2,
            strokeColor:'black'
          }
        },
        zIndex:5,
        name:'Back Bone'
      });

    const shoulder = new Bone({
        id:"shoulder",
        start:new this.scope.Point(243, 103),
        end:new this.scope.Point(269, 103),
        muscleWidth:{start:15, end:15},
        border:{
          strokeWidth:1,
          strokeColor:'black'
        },
        joints:{
          start:{
            radius:13,
            strokeColor:'black'
          },
          end:{
            radius:13,
            strokeColor:'black'
          }
        },
        zIndex:6,
        name:'Shoulder'
      });
    const leftHand = new Bone({
        id:"leftHand",
        start:new this.scope.Point(243, 103),
        end:new this.scope.Point(243, 210),
        muscleWidth:{start:15, end:15},
        joints:{
          start:{
            radius:13,
            strokeColor:'black'
          },
          end:{
            radius:15,
            strokeColor:'white'
          }
        },
        zIndex:6,
        name:'Left Hand'
      });
    const leftFHand = new Bone({
        id:"leftFHand",
        start:new this.scope.Point(243, 210),
        end:new this.scope.Point(243, 325),
        muscleWidth:{start:15, end:15},
        joints:{
          start:{
            radius:15,
            strokeColor:'white'
          },
          end:{
            radius:15,
            strokeColor:'white'
          }
        },
        zIndex:6,
        name:'Left Elbow'
      });
    const rightHand = new Bone({
        id:"rightHand",
        start:new this.scope.Point(269, 103),
        end:new this.scope.Point(269, 215),
        muscleWidth:{start:15, end:15},
        joints:{
          start:{
            radius:13,
            strokeColor:'black'
          },
          end:{
            radius:15,
            strokeColor:'white'
          }
        },
        zIndex:1,
        name:'Right Hand'
      });
    const rightFHand = new Bone({
        id:"rightFHand",
        start:new this.scope.Point(269, 215),
        end:new this.scope.Point(269, 325),
        muscleWidth:{start:15, end:15},
        joints:{
          start:{
            radius:15,
            strokeColor:'white'
          },
          end:{
            radius:15,
            strokeColor:'white'
          }
        },
        zIndex:1,
        name:'Right Elbow'
      });

    shoulder.setStartJoint([leftHand]);
    shoulder.setEndJoint([rightHand]);
    rightHand.setEndJoint([rightFHand]);
    leftHand.setEndJoint([leftFHand]);

    const waist = new Bone({
        id:"waist",
        start:new this.scope.Point(245, 265),
        end:new this.scope.Point(265, 265),
        muscleWidth:{start:20, end:20},
        joints:{
          start:{
            radius:20,
            strokeColor:'white'
          },
          end:{
            radius:20,
            strokeColor:'white'
          }
        },
        zIndex:5,
        name:'Waist'
      });
    const leftLeg = new Bone({
        id:"leftLeg",
        start:new this.scope.Point(245, 265),
        end:new this.scope.Point(245, 384),
        muscleWidth:{start:20, end:20},
        joints:{
          start:{
            radius:20,
            strokeColor:'white'
          },
          end:{
            radius:20,
            strokeColor:'white'
          }
        },
        zIndex:5,
        name:'Left Leg'
      });
    const leftFLeg = new Bone({
        id:"leftFLeg",
        start:new this.scope.Point(245, 384),
        end:new this.scope.Point(245, 491),
        muscleWidth:{start:20, end:20},
        joints:{
          start:{
            radius:20,
            strokeColor:'white'
          },
          end:{
            radius:20,
            strokeColor:'white'
          }
        },
        zIndex:5,
        name:'Left Lower Leg'
      });
    const rightLeg = new Bone({
        id:"rightLeg",
        start:new this.scope.Point(265, 265),
        end:new this.scope.Point(265, 384),
        muscleWidth:{start:20, end:20},
        joints:{
          start:{
            radius:20,
            strokeColor:'white'
          },
          end:{
            radius:20,
            strokeColor:'white'
          }
        },
        zIndex:1,
        name:'Right Leg'
      });
    const rightFLeg = new Bone({
        id:"rightFLeg",
        start:new this.scope.Point(265, 384),
        end:new this.scope.Point(265, 491),
        muscleWidth:{start:20, end:20},
        joints:{
          start:{
            radius:20,
            strokeColor:'white'
          },
          end:{
            radius:20,
            strokeColor:'white'
          }
        },
        zIndex:1,
        name:'Right Lower Leg'
      });

    waist.setStartJoint([leftLeg]);
    waist.setEndJoint([rightLeg]);
    rightLeg.setEndJoint([rightFLeg]);
    leftLeg.setEndJoint([leftFLeg]);

    backBone.setStartJoint([waist]);
    backBone.addJointPath(shoulder);

    const headPath = new this.scope.Path.Circle(new this.scope.Point(255, 36), 40);
    headPath.strokeColor = 'black';
    headPath.fillColor = 'black';
    headPath.zIndex = 0;
    const head = new PathObj({
      id:"head",
      name:"head",
      path:headPath,
      zIndex:2
    });
    backBone.addJointPath(head);

    this.bones = [leftHand, leftFHand, rightHand, rightFHand, leftLeg, leftFLeg, rightLeg, rightFLeg, backBone, waist, shoulder];
    this.paths = [head];
    this.bones.forEach(bone => bone.setGroup(this.group));
    this.paths.forEach(path => path.setGroup(this.group));

  }
}

window.animaticonObjects.ANIMATICON_MAN_BASIC_SIDE = ANIMATICON_MAN_BASIC_SIDE;
