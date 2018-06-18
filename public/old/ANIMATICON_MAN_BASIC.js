class ANIMATICON_MAN_BASIC {
  constructor(bones, scope, animaticonObjName) {
      this.bones = [];
      this.paths = [];
      this.scope = scope ? scope : paper;
      this.animaticonObjName = animaticonObjName || "ANIMATICON_MAN_BASIC";
      this.group = new this.scope.Group();
      if(!bones) {
        this.getHumanBones();
      }
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
        scope:this.scope,
        start:new this.scope.Point(255, 270),
        end:new this.scope.Point(255, 90),
        muscleWidth:{start:50, end:50},
        border:{
          strokeWidth:1,
          strokeColor:'black'
        },
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
        zIndex:4,
        name:'Back Bone'
      });

    const shoulder = new Bone({
        id:"shoulder",
        scope:this.scope,
        start:new this.scope.Point(209, 103),
        end:new this.scope.Point(301, 103),
        muscleWidth:{start:15, end:15},
        border:{
          strokeWidth:1,
          strokeColor:'black'
        },
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
        name:'Shoulder'
      });

    const leftHand = new Bone({
        id:"leftHand",
        scope:this.scope,
        start:new this.scope.Point(209, 103),
        end:new this.scope.Point(209, 210),
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
        scope:this.scope,
        start:new this.scope.Point(209, 210),
        end:new this.scope.Point(209, 325),
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
        scope:this.scope,
        start:new this.scope.Point(301, 103),
        end:new this.scope.Point(301, 215),
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
        name:'Right Hand'
      });
    const rightFHand = new Bone({
        id:"rightFHand",
        scope:this.scope,
        start:new this.scope.Point(301, 215),
        end:new this.scope.Point(301, 325),
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
        name:'Right Elbow'
      });

    shoulder.setStartJoint([leftHand]);
    shoulder.setEndJoint([rightHand]);
    rightHand.setEndJoint([rightFHand]);
    leftHand.setEndJoint([leftFHand]);

    const waist = new Bone({
        id:"waist",
        scope:this.scope,
        start:new this.scope.Point(228, 265),
        end:new this.scope.Point(282, 265),
        muscleWidth:{start:20, end:20},
        border:{
          strokeWidth:1,
          strokeColor:'black'
        },
        joints:{
          start:{
            radius:20,
            strokeColor:'black'
          },
          end:{
            radius:20,
            strokeColor:'black'
          }
        },
        zIndex:5,
        name:'Waist'
      });
    const leftLeg = new Bone({
        id:"leftLeg",
        scope:this.scope,
        start:new this.scope.Point(228, 265),
        end:new this.scope.Point(228, 384),
        muscleWidth:{start:20, end:20},
        joints:{
          start:{
            radius:20,
            strokeColor:'black'
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
        scope:this.scope,
        start:new this.scope.Point(228, 384),
        end:new this.scope.Point(228, 491),
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
        scope:this.scope,
        start:new this.scope.Point(282, 265),
        end:new this.scope.Point(282, 384),
        muscleWidth:{start:20, end:20},
        joints:{
          start:{
            radius:20,
            strokeColor:'black'
          },
          end:{
            radius:20,
            strokeColor:'white'
          }
        },
        zIndex:5,
        name:'Right Leg'
      });
    const rightFLeg = new Bone({
        id:"rightFLeg",
        scope:this.scope,
        start:new this.scope.Point(282, 384),
        end:new this.scope.Point(282, 491),
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
      id:'head',
      scope:this.scope,
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

window.animaticonObjects.ANIMATICON_MAN_BASIC = ANIMATICON_MAN_BASIC;
