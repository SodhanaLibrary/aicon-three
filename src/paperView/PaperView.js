import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import config from '../../config/appConfig';

class PaperView extends React.Component {
  constructor(props) {
    super(props);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.init = this.init.bind(this);
    this.renderCanvas = this.renderCanvas.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onDropDiv = this.onDropDiv.bind(this);
    this.selectDiv = this.selectDiv.bind(this);
    this.updateDivDimension = this.updateDivDimension.bind(this);
    this.divTextChange = this.divTextChange.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const width = 1280 / 1.6, height = 720 / 1.6;
    const clock = new THREE.Clock();
    this.props.actions.setClock(clock);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector3(0, 0, 0);
    this.currentTime = -1;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xfafafa );
    const camera = new THREE.OrthographicCamera( width / - 2, width  / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.set( 0, 0, 900 );
    camera.lookAt(0,0,0);
    scene.add( camera );
    this.camera = camera;
    this.renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true  } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( width, height );
    this.canvasDiv.appendChild( this.renderer.domElement );
    this.props.actions.updateSize({
      width,
      height
    });
    this.props.actions.setMainScene(scene);
    this.props.actions.updateRenderer(this.canvasDiv);
    this.renderCanvas( scene, camera );
  }

  resetSelection() {
    this.props.actions.setSelectedGroup(null);
    this.props.actions.setSelectedAnimationControl(null);
    this.props.actions.setSelectedPath(null);
    this.props.actions.setSelectedDiv(null);
  }

  handleClick() {
    let selectedGroup, selectedPath, selectedSegment, selectedSegmentDistance = 1000;
    this.props.paths.forEach(path3 => {
      let intersects = this.raycaster.intersectObjects(path3.path.children);
      if(intersects.length > 0) {
        selectedPath = path3;
        selectedSegment = intersects[0].object;
        if(selectedSegment) {
          this.props.actions.setSelectedSegment(selectedSegment);
        }
        this.props.actions.setSelectedPath(selectedPath);
        this.props.actions.setSelectedAnimationControl(null);
      } else {
        intersects = this.raycaster.intersectObjects([path3.path]);
        if(intersects.length > 0) {
          selectedPath = path3;
          this.dragActive = false;
          this.props.actions.setSelectedPath(selectedPath);
          this.props.actions.setSelectedAnimationControl(null);
        }
      }
    });

    if(!selectedPath) {
      this.props.animaticonGroups.forEach(group => {
        const intersects = this.raycaster.intersectObjects(group.getAllMusles());
        if(intersects.length > 0) {
          selectedGroup = group;
          this.props.actions.setSelectedGroup(selectedGroup);
          this.props.actions.setSelectedAnimationControl(null);
        }
      });
    }

    if(!selectedGroup && !selectedPath) {
      this.dragActive = false;
      this.resetSelection();
    } else {
      this.dragActive = true;
    }
  }

  onMouseUp() {
    this.dragActive = false;
  }

  renderCanvas (scene, camera) {
    const {isAnimationCompleted, animationControls} = this.props;

    this.raycaster.setFromCamera( this.mouse, camera );
	  requestAnimationFrame( () => this.renderCanvas(scene, camera) );

    if(!this.props.isAnimationCompleted) {
      let animationCompleted = true;
      animationControls.forEach(fr => {
        if(this.props.clock.getElapsedTime() > fr.startAt) {
          fr.animate(this.props.clock.getElapsedTime());
        }
        animationCompleted = animationCompleted && fr.done;
      });
      if(animationCompleted) {
         this.props.actions.setAnimationCompleted(true);
      }
      TWEEN.update();
    }

    this.renderer.render( scene, camera );
  }

  onMouseDown(event) {
    this.hitItems = [];
    const hitResult2 = this.props.mainScene.project.hitTest(event.point, config.hitOptions);
    const hitResultGroup = this.props.animaticonGroups.find(grpObj => grpObj.group.hitTest(event.point, config.hitOptions));
    const hitResultPath = this.props.paths.find(pObj => pObj.path.hitTest(event.point, config.hitOptions));
    if(hitResultPath && hitResult2.type === 'segment') {
      this.props.actions.setSelectedSegment(hitResult2.segment);
    } else if(this.props.selectedGroup && hitResultPath) {
      this.props.actions.setSelectedPath(hitResultPath);
    } else if(!hitResultGroup) {
      if(hitResultPath && hitResult2.type !== 'stroke' && hitResult2.type !== 'segment') {
        this.props.actions.setSelectedPath(hitResultPath);
      } else if(hitResult2) {
        let pathObj;
        if(!hitResultPath) {
          hitResult2.item.selected = true;
          hitResult2.item.strokeWidth = 1;
          pathObj = new PathObj({
            path:hitResult2.item,
            type:hitResult2.item._content ? 'Text' : undefined
          });
          this.props.actions.addPath(pathObj);
          this.props.actions.setSelectedPath(pathObj);
        } else {
          this.props.actions.setSelectedPath(hitResultPath);
          pathObj = hitResultPath;
        }
        if (hitResult2.type == 'stroke' && pathObj.props.type !== 'Translate') {
          hitResult2.item.insert(hitResult2.location.index + 1, event.point);
    	  } else if(hitResult2.type == 'segment' && this.props.selectedPath) {
          this.props.actions.setSelectedSegment(hitResult2.segment);
        }
      } else {
        this.resetSelection();
        return;
      }
    } else {
      this.props.actions.setSelectedGroup(hitResultGroup);
      this.props.actions.setSelectedAnimationControl(null);
    }
  }

  onMouseMove(event) {
    const {selectedSegment, selectedPath, selectedGroup} = this.props;
    this.mouse.x = ( (event.clientX - this.canvasDiv.offsetLeft) / this.canvasDiv.clientWidth ) * 2 - 1;
	  this.mouse.y = - ( (event.clientY - this.canvasDiv.offsetTop) / this.canvasDiv.clientHeight ) * 2 + 1;
    const point = {
      x :(event.clientX - this.canvasDiv.offsetLeft) - this.canvasDiv.clientWidth / 2,
      y : - (event.clientY - this.canvasDiv.offsetTop) + this.canvasDiv.clientHeight / 2
    };

    if(!this.previousPoint) {
      this.previousPoint = point;
    }

    if(this.dragActive) {
      if(selectedSegment) {
        selectedPath.setVertex(selectedSegment, {
          x:point.x - this.previousPoint.x,
          y:point.y - this.previousPoint.y
        });
        selectedPath.path.geometry.verticesNeedUpdate = true;
      } else if(selectedGroup) {
        selectedGroup.group.position.x += point.x - this.previousPoint.x;
        selectedGroup.group.position.y += point.y - this.previousPoint.y;
        selectedGroup.updateProps();
      } else if(selectedPath){
        selectedPath.path.position.x += point.x - this.previousPoint.x;
        selectedPath.path.position.y += point.y - this.previousPoint.y;
        selectedPath.updateProps();
      }
    }

    this.previousPoint =  point;

    document.getElementById("canvas_point_x").innerHTML = point.x;
    document.getElementById("canvas_point_y").innerHTML = point.y;
  }

  onKeyDown(event) {
    const {selectedPath, selectedGroup, selectedSegment} = this.props;
    const selected = selectedSegment ? selectedSegment : selectedPath ? selectedPath.path : (selectedGroup ? selectedGroup.group : null);
    if(selectedSegment) {
      const position = selectedSegment.position;
      switch (event.nativeEvent.key) {
        case 'ArrowUp':
          position.y += 1;
          break;
        case 'ArrowDown':
          position.y -= 1;
          break;
        case 'ArrowLeft':
          position.x -= 1;
          break;
        case 'ArrowRight':
          position.x += 1;
          break;
      }
      this.props.selectedSegment.parent.geometry.vertices[selectedSegment.name].set(position.x, position.y, position.z);
      this.props.selectedPath.path.geometry.verticesNeedUpdate = true;
    } else if(selected) {
      const position = selected.position ?  selected.position : selected.point;
      switch (event.nativeEvent.key) {
        case 'ArrowUp':
          position.y += 1;
          break;
        case 'ArrowDown':
          position.y -= 1;
          break;
        case 'ArrowLeft':
          position.x -= 1;
          break;
        case 'ArrowRight':
          position.x += 1;
          break;
      }

      if(selectedPath) {
        selectedPath.updateProps();
      } else {
        selectedGroup.updateProps();
      }

      if(selectedPath && event.nativeEvent.key === 'd' && event.nativeEvent.ctrlKey) {
        this.props.actions.addPath(selectedPath.clone());
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.selectedGroup && nextProps.selectedGroup) {
      if(this.props.selectedGroup.id !== nextProps.selectedGroup.id) {
        // this.props.selectedGroup.group.bounds.selected = false;
        // nextProps.selectedGroup.group.bounds.selected = true;
      }
    } else if(nextProps.selectedGroup && !this.props.selectedGroup) {
      //nextProps.selectedGroup.group.bounds.selected = true;
    } else if(!nextProps.selectedGroup && this.props.selectedGroup) {
      //this.props.selectedGroup.group.bounds.selected = false;
    }

    if(this.props.selectedPath && nextProps.selectedPath) {
      if(this.props.selectedPath !== nextProps.selectedPath) {
        // this.props.selectedPath.path.selected = false;
        // nextProps.selectedPath.path.selected = true;
      }
    } else if(nextProps.selectedPath && !this.props.selectedPath) {
      //nextProps.selectedPath.path.selected = true;
    } else if(!nextProps.selectedPath && this.props.selectedPath) {
      //this.props.selectedPath.path.selected = false;
    }
  }

  selectDiv(event, dv) {
    event.stopPropagation();
    this.props.actions.setSelectedDiv(dv);
  }

  updateDivDimension(event) {
    if(this.props.selectedDiv) {
      const style = JSON.parse(this.props.selectedDiv.style);
      style.width = event.target.clientWidth + 'px';
      style.height = event.target.clientHeight + 'px';
      this.props.selectedDiv.style = JSON.stringify(style, null, 1);
    }
  }

  onDropDiv(event) {
    if(this.props.selectedDiv) {
      this.props.actions.removeDiv(this.props.selectedDiv);
      const style = JSON.parse(this.props.selectedDiv.style);
      style.left = (event.clientX - this.canvasDiv.offsetLeft) + 'px';
      style.top = (event.clientY - this.canvasDiv.offsetTop) + 'px';
      const dv = Object.assign(this.props.selectedDiv, {style: JSON.stringify(style, null, 1)});
      this.props.actions.setSelectedDiv(dv);
      this.props.actions.addDiv(dv);
    }
  }

  divTextChange(event) {
    if(this.props.selectedDiv) {
      this.props.selectedDiv.text = event.target.value;
    }
  }

  render() {
    const {selectedDiv} = this.props;
    return <div className="mainCanvas__wrapper"><div onDragOver={(event) => event.preventDefault()} onDrop={this.onDropDiv} onMouseMove={this.onMouseMove} onKeyDown={this.onKeyDown} onMouseDown={this.handleClick} onMouseUp={this.onMouseUp} className="mainCanvas" tabIndex="0" ref={(ref) => this.canvasDiv = ref}>
      {this.props.divs.map((dv, i) => {
        const style = JSON.parse(dv.style);
        if(dv === selectedDiv) {
          style.border = '1px solid #ccc';
          style.resize = 'both';
        } else {
          style.border = '0px';
          style.resize = 'none';
        }
        return <textarea spellCheck="false" onChange={this.divTextChange} onMouseDown={(event) => this.selectDiv(event, dv)} key={i} onMouseUp={this.updateDivDimension} className="canvas-absolute-div" draggable={true} onDragStart={(event) => this.selectDiv(event, dv)} style={style}>{dv.text}</textarea>
      })}
    </div></div>
  }

}

export default connect(
  state => ({
    isAnimationCompleted:state.animation.isAnimationCompleted,
    selectedGroup:state.app.selectedGroup,
    selectedPath:state.app.selectedPath,
    selectedSegment:state.app.selectedSegment,
    selectedDiv:state.app.selectedDiv,
    animaticonGroups:state.app.animaticonGroups,
    animationControls:state.animation.controls,
    divs:state.app.divs,
    mainScene:state.app.mainScene,
    clock:state.animation.clock,
    paths:state.app.paths || []
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(PaperView);
