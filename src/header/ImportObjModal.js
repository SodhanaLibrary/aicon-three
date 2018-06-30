import React from 'react';
import * as appActions from '../actions/appActions'
import * as globalActions from '../actions/globalActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CommonSVG from '../common/CommonSVG';
import config from '../../config/appConfig';
import classNames from 'classnames';
import {Modal, Button} from 'react-bootstrap';
import Utils from '../common/Utils';


class ImportObjModal extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      img:'',
      imgFile:null,
      pathDefinition:''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.previewFile = this.previewFile.bind(this);
    this.importImg = this.importImg.bind(this);
  }

  handleChange(event) {
    this.setState({
    [event.target.name]:  event.target.value
    });
  }

  previewFile(event) {
     const file = event.target.files[0]
     var reader  = new FileReader();
     reader.onloadend = () => {
         this.setState({
           img:reader.result,
           imgFile:file
         });
     }
     if (file) {
         reader.readAsDataURL(file); //reads the data as a URL
     } else {
       this.setState({
         img:""
       });
     }
  }

  handleClose() {
    this.props.actions.showHideImportObjModal(false);
  }

  importImg(event) {
    var loader = new THREE.SVGLoader();
    loader.load(this.state.img,( paths ) =>  {
        for ( let i = 0; i < paths.length; i ++ ) {
          const path = paths[ i ];
          const material = new THREE.MeshBasicMaterial( {
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false
          } );
          const shapes = path.toShapes( true );
          for ( let j = 0; j < shapes.length; j ++ ) {
            const shape = shapes[ j ];
            const geometry = new THREE.ShapeBufferGeometry( shape );
            const mesh = new THREE.Mesh( geometry, material );
            geometry.center();
            const pathObj = new window.animaticonObjects.PathObj3({
              path:mesh,
              scene:this.props.mainScene,
              id:'path'+j,
              name:'path'+j
            });
            this.props.actions.addPath(pathObj);
          }
        }
        this.props.mainScene.add( group );
        // var helper = new THREE.BoxHelper(group, 0xff0000);
        // helper.update();
        // // If you want a visible bounding box
        // this.props.mainScene.add(helper);
    	}
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.pathDefinition.length > 0) {
      const material = new THREE.MeshBasicMaterial( {
        color: 0x000000,
        side: THREE.DoubleSide,
        morphTargets: true
      } );
      //const geometry = new THREE.ShapeBufferGeometry(Utils.transformSVGPath(this.state.pathDefinition));

      const geometry = new THREE.ShapeBufferGeometry(Utils.transformSVGPath(this.state.pathDefinition));
      //const geometry2 = new THREE.ExtrudeGeometry( Utils.transformSVGPath('M211.305,210.80925c-4.762,-35.481 -20.327,-67.942 -83.694,-94.362c20.316,-21.637 -115.569,-22.037 -95.222,0c-22.948,26.419 -38.482,58.88 -43.694,44.362z'), extrudeSettings );
       geometry.translate(-200,-200, 0);
       //geometry2.translate(-200,-200, 0);

      // for ( var i = 0; i < 4; i ++ ) {
			// 		var vertices = [];
			// 		for ( var v = 0; v < geometry.vertices.length; v ++ ) {
			// 			vertices.push( geometry.vertices[ v ].clone() );
			// 			if ( v === i ) {
			// 				vertices[ vertices.length - 1 ].x *= 2;
			// 				vertices[ vertices.length - 1 ].y *= 2;
			// 				vertices[ vertices.length - 1 ].z *= 2;
			// 			}
			// 		}
			// 		geometry.morphTargets.push( { name: "target" + i, vertices: vertices } );
			// }

      //geometry.morphTargets[0] = {name: 't1', vertices: geometry2.vertices};

      const mesh = new THREE.Mesh( geometry, material );

      const pathObj = new window.animaticonObjects.PathObj3({
        path:mesh,
        scene:this.props.mainScene,
        id:'path'+this.props.paths.length,
        name:'path'
      });

      //mesh.morphTargetInfluences[0] = 0.2;

      this.props.actions.addPath(pathObj);
    } else {
      this.importImg(event);
    }
    this.props.actions.showHideImportObjModal(false);
    return false;
  }

  render() {
    return <Modal show={this.props.showImportObjModal} onHide={this.handleClose}>
              <div className="modal-header">
                <h5 className="modal-title">Import</h5>
                <button type="button" className="close" onClick={this.handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Upload image</label>
                    <div className="col-sm-8">
                      <input type="file" onChange={this.previewFile}/> <br/>
                      <img src={this.state.img} className="modal-body-img-preview"/>
                    </div>
                  </div>
                  <div className="imports-object-modal--or">OR</div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Path definition</label>
                    <div className="col-sm-8">
                      <textarea name="pathDefinition" className="imports-object-modal--pathDefinition" placeholder="ex: M511.305,396.85125c-4.762,-35.481 -20.327,-67.942 -43.694,-94.362c20.316,-21.637 -115.569,-22.037 -95.222,0c-22.948,26.419 -38.482,58.88 -43.694,94.362z" onChange={this.handleChange} value={this.state.pathDefinition}> </textarea>
                    </div>
                  </div>
                  <div className="form-group modal-footer--buttons ">
                    <button type="submit" className="btn btn-secondary btn-sm">Submit</button>
                  </div>
                </form>
              </div>
            </Modal>;
  }
}

export default connect(
  state => ({
    mainScene:state.app.mainScene,
    paths:state.app.paths,
    showImportObjModal:state.global.showImportObjModal,
    bones:state.app.bones || [],
    paths:state.app.paths || []
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, globalActions, appActions), dispatch)
  })
)(ImportObjModal);
