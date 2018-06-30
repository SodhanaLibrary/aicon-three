import React from 'react';
import * as appActions from '../actions/appActions'
import * as apiActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Modal, Button} from 'react-bootstrap';
import Utils from '../common/Utils';

const initStyle = `{
  "width":"100px",
  "height":"100px",
  "left":"10px",
  "top":"10px",
  "fontSize":"30px"
}`;
class ShapesModal extends React.Component{
  constructor(props){
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.draw = this.draw.bind(this);
    this.state = {
      showShapes:true,
      selectedType:null,
      text:'',
      style:initStyle,
      width:100,
      height:100
    };
    this.handleChange = this.handleChange.bind(this);
    this.createText = this.createText.bind(this);
  }

  handleClose() {
    this.setState({
      showShapes:true,
      selectedType:null
    });
    this.props.actions.showHideShapesModal(false);
  }

  handleChange(event) {
    this.setState({
     [event.target.name]:  event.target.value
    });
  }

  draw(type) {
    let path, pathData;
    if(type === 'Circle') {
      path = Utils.getCirclePath();
    } else if(type === 'Line') {
        const line = new THREE.Path();
        line.lineTo( 0, 100 );
        const geometry = new THREE.Geometry().setFromPoints( line.getPoints() );
        const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
        path = new THREE.Line( geometry, material );
        pathData = {
          vertices:geometry.vertices
        }
    } else if(type === 'Translate') {
      path = new this.props.mainScene.Path.Line(new this.props.mainScene.Point(255, 36), new this.props.mainScene.Point(355, 36));
    } else if(type === 'bone') {
      const res = Utils.getSkeleton();
      res.scene = this.props.mainScene;
      const obj = new window.animaticonObjects.AnimaticonObj3(res);
      this.props.actions.addAnimaticonGroup(obj);
      this.props.actions.setSelectedGroup(obj);
      this.props.actions.setSelectedAnimationControl(null);
      this.props.actions.addBones(obj.bones);
      this.props.actions.showHideShapesModal(false);
      return true;
    }
    if(path) {
      const pathObj = new window.animaticonObjects.PathObj3({
        path,
        pathData,
        scene:this.props.mainScene,
        id:'path',
        name:'path',
        type,
        showDots:true
      });
      this.props.actions.setSelectedPath(pathObj);
      this.props.actions.addPath(pathObj);
      this.props.actions.showHideShapesModal(false);
    } else {
      this.setState({
        selectedType:type,
        showShapes:false
      });
    }
  }

  createRectangle() {
    const {width, height, selectedType} = this.state;
    const geometry = new THREE.PlaneGeometry( parseInt(width), parseInt(height), 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
    const path = new THREE.Mesh( geometry, material );
    const pathObj = new window.animaticonObjects.PathObj3({
      path,
      type:selectedType,
      scene:this.props.mainScene,
      id:'path',
      name:'path'
    });
    this.setState({
      showShapes:true,
      selectedType:null
    });
    this.props.actions.setSelectedPath(pathObj);
    this.props.actions.addPath(pathObj);
    this.props.actions.showHideShapesModal(false);
  }

  createCustomGeometry() {
    let {width, height, segments, selectedType} = this.state;
    width = parseInt(width);
    height = parseInt(height);
    segments = parseInt(segments);
    const material = new THREE.MeshBasicMaterial( { color : 0x0000ff, side:THREE.DoubleSide, wireframe:true } );
    const geometry = new THREE.ParametricGeometry((u, v, target) => {
        var x = u * width;
        var z = 0;
        var y = v * height;
        target.set(x, y, z);
    }, 1, segments);
    geometry.verticesNeedUpdate = true;
    const path = new THREE.Mesh( geometry, material );
    const pathObj = new window.animaticonObjects.PathObj3({
      path,
      scene:this.props.mainScene,
      type:selectedType,
      id:'path',
      name:'path',
      pathData: {
        width,
        height,
        segments
      }
    });
    this.setState({
      showShapes:true,
      selectedType:null
    });
    this.props.actions.setSelectedPath(pathObj);
    this.props.actions.addPath(pathObj);
    this.props.actions.showHideShapesModal(false);
  }

  createText() {
    const {style, text} = this.state;
    this.setState({
      showShapes:true,
      selectedType:null
    });
    this.props.actions.addDiv({
      style,
      text
    });
    this.props.actions.showHideShapesModal(false);
  }

  render() {
    return <Modal show={this.props.showShapesModal} onHide={this.handleClose}>
              <div className="modal-header">
                <h5 className="modal-title">Pre-defined shapes</h5>
                <button type="button" className="close" onClick={this.handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                 {this.state.showShapes && <div className="shapes_body">
                   <div className="shapes_body__item" onClick={() => this.draw('Circle')}>
                     <img className="shapes_body__item--img" src="/img/circle.svg"/>
                     <div className="shapes_body__item--name">Circle</div>
                   </div>
                   <div className="shapes_body__item" onClick={() => this.draw('Line')}>
                     <img className="shapes_body__item--img"  src="/img/line.svg"/>
                     <div className="shapes_body__item--name">Line</div>
                   </div>
                   <div className="shapes_body__item" onClick={() => this.draw('Rectangle')}>
                     <img className="shapes_body__item--img"  src="/img/rectangle.svg"/>
                     <div className="shapes_body__item--name">Rectangle</div>
                   </div>
                   <div className="shapes_body__item" onClick={() => this.draw('custom-geometry')}>
                     <i className="fas fa-table"></i>
                     <div className="shapes_body__item--name">Custom Geometry</div>
                   </div>
                   <div className="shapes_body__item" onClick={() => this.draw('bone')}>
                     <img className="shapes_body__item--img"  src="/img/bone.svg"/>
                     <div className="shapes_body__item--name">Skeleton</div>
                   </div>
                   <div className="shapes_body__item" onClick={() => this.draw('Text')}>
                     <img className="shapes_body__item--img"  src="/img/text.svg"/>
                     <div className="shapes_body__item--name">Text</div>
                   </div>
                 </div>}
                 {!this.state.showShapes && this.state.selectedType === 'Rectangle' && <div>
                   <div className="form-group row">
                     <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Width</label>
                     <div className="col-sm-7">
                       <input type="text" className="form-control form-control-sm" name="width" required={true} value={this.state.width} onChange={this.handleChange}/>
                     </div>
                   </div>
                   <div className="form-group row">
                     <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Height</label>
                     <div className="col-sm-7">
                       <input type="text" className="form-control form-control-sm" name="height" value={this.state.height} onChange={this.handleChange}/>
                     </div>
                   </div>
                   <div className="form-group">
                     <button type="submit" onClick={() => this.createRectangle()} className="btn btn-secondary btn-sm">Create {this.state.selectedType}</button>
                   </div>
                 </div>}

                 {!this.state.showShapes && this.state.selectedType === 'Text' && <div>
                   <div className="form-group row">
                     <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Style</label>
                     <div className="col-sm-7">
                       <textarea rows="7" type="text" className="form-control form-control-sm" name="style" value={this.state.style} onChange={this.handleChange}/>
                     </div>
                   </div>
                   <div className="form-group row">
                     <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Text</label>
                     <div className="col-sm-7">
                       <input type="text" className="form-control form-control-sm" name="text" value={this.state.text} onChange={this.handleChange}/>
                     </div>
                   </div>
                   <div className="form-group">
                     <button type="submit" onClick={() => this.createText()} className="btn btn-secondary btn-sm">Create {this.state.selectedType}</button>
                   </div>
                 </div>}

                 {!this.state.showShapes && this.state.selectedType === 'custom-geometry' && <div>
                   <div className="form-group row">
                     <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Width</label>
                     <div className="col-sm-7">
                       <input type="text" className="form-control form-control-sm" name="width" required={true} value={this.state.width} onChange={this.handleChange}/>
                     </div>
                   </div>
                   <div className="form-group row">
                     <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Height</label>
                     <div className="col-sm-7">
                       <input type="text" className="form-control form-control-sm" name="height" value={this.state.height} onChange={this.handleChange}/>
                     </div>
                   </div>
                   <div className="form-group row">
                     <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Segments</label>
                     <div className="col-sm-7">
                       <input type="text" className="form-control form-control-sm" name="segments" value={this.state.segments} onChange={this.handleChange}/>
                     </div>
                   </div>
                   <div className="form-group">
                     <button type="submit" onClick={() => this.createCustomGeometry()} className="btn btn-secondary btn-sm">Create Geometry</button>
                   </div>
                 </div>}
              </div>
            </Modal>;
  }
}

export default connect(
  state => ({
    showShapesModal:state.app.showShapesModal,
    mainScene:state.app.mainScene
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(ShapesModal);
