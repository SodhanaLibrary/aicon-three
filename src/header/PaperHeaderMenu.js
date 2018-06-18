import React from 'react';
import * as appActions from '../actions/appActions';
import * as animationActions from '../actions/animationActions';
import * as globalActions from '../actions/globalActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import utils from '../common/Utils';
import ShapesModal from './ShapesModal';
import GlobalMessageModal from './GlobalMessageModal';
import AnimaticonObjSetsModal from './AnimaticonObjSetsModal';
import ImportObjModal from './ImportObjModal';

class PaperHeaderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.removeSelectedGroupOrPath = this.removeSelectedGroupOrPath.bind(this);
    this.openDrawModel = this.openDrawModel.bind(this);
    this.import = this.import.bind(this);
    this.openDrawModel = this.openDrawModel.bind(this);
    this.exportToSVG = this.exportToSVG.bind(this);
    this.save = this.save.bind(this);
    this.flipPath = this.flipPath.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  exportToSVG() {
    this.props.actions.showHideGlobalMessageModal(true);
    this.props.actions.updateGlobalMessage(this.props.selectedPath.path.exportSVG().outerHTML);
  }

  removeSelectedGroupOrPath() {
    if(this.props.selectedPath) {
      this.props.actions.removePath(this.props.selectedPath);
      this.props.selectedPath.remove();
      this.props.actions.setSelectedPath(null);
    } else {
      this.props.actions.removeAnimaticonGroup(this.props.selectedGroup);
      const cntrls = this.props.animationControls.filter(cntrl => cntrl.group === this.props.selectedGroup);
      cntrls.forEach(cntrl => this.props.actions.removeAnimationControl(cntrl));
      this.props.actions.removeAnimaticonGroup(this.props.selectedGroup);
      this.props.selectedGroup.remove();
      this.props.actions.setSelectedGroup(null);
      this.props.actions.removeBones(this.props.selectedGroup.bones);
      this.props.actions.removePaths(this.props.selectedGroup.paths);
    }
  }

  scale(factor) {
    if(this.props.selectedGroup) {
      this.props.selectedGroup.group.scale.x += factor;
      this.props.selectedGroup.group.scale.y += factor;
    } else if(this.props.selectedPath) {
      this.props.selectedPath.path.scale.x += factor;
      this.props.selectedPath.path.scale.y += factor;
    }
  }

  rotate(angle) {
    if(this.props.selectedGroup) {
      this.props.selectedGroup.group.rotation.z += angle;
    } else if(this.props.selectedPath) {
      this.props.selectedPath.path.rotation.z += angle;
    }
  }

  flipPath() {
    if(this.props.selectedGroup) {
      this.props.selectedGroup.group.scale.x = -this.props.selectedGroup.group.scale.x;
    } else if(this.props.selectedPath) {
      this.props.selectedPath.path.scale.x = -this.props.selectedGroup.group.scale.x;
    }
  }

  save() {
    this.props.actions.showHideAnimaticonObjSetsModal(true);
  }

  clearAll() {
    while(this.props.mainScene.children.length > 0){
      this.props.mainScene.remove(this.props.mainScene.children[0]);
    }
    this.props.actions.clearPaper();
  }

  openDrawModel() {
    this.props.actions.showHideShapesModal(true);
  }

  import() {
    this.props.actions.showHideImportObjModal(true);
    //utils.loadImageToCanvas('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMzGhSl7T9JqXDJdzxgWbUXfmr7aw8u-gsqiL9VVRWoCmJEQLe9Q', this.props.mainScene);
  }

  render() {
    const {paths, bones, animaticonGroups} = this.props;
    return <div className="body_content__tab--actions">
       <a href="#" title="Delete" className={classNames("btn btn-primary btn-sm", {disabled:!this.props.selectedGroup && !this.props.selectedPath})} onClick={this.removeSelectedGroupOrPath} role="button" aria-pressed="true"><i className="fas fa-trash-alt"></i></a>
       <a href="#" title="Scale" className={classNames("btn btn-primary btn-sm", {disabled:!this.props.selectedGroup && !this.props.selectedPath})} onClick={() => this.scale(0.01)} role="button" aria-pressed="true">+</a>
       <a href="#" title="Scale" className={classNames("btn btn-primary btn-sm", {disabled:!this.props.selectedGroup && !this.props.selectedPath})} onClick={() => this.scale(-0.01)} role="button" aria-pressed="true">-</a>
       <a href="#" title="Rotate Clockwise" className={classNames("btn btn-primary btn-sm", {disabled:!this.props.selectedGroup && !this.props.selectedPath})} onClick={() => this.rotate(Math.PI / 120)} role="button" aria-pressed="true"><i className="fas fa-chevron-circle-right"></i></a>
       <a href="#" title="Rotate Anti Clockwise" className={classNames("btn btn-primary btn-sm", {disabled:!this.props.selectedGroup && !this.props.selectedPath})} onClick={() => this.rotate(- Math.PI / 120)} role="button" aria-pressed="true"><i className="fas fa-chevron-circle-left"></i></a>
       <a href="#" title="Draw" className="btn btn-primary btn-sm" onClick={this.openDrawModel} role="button" aria-pressed="true"><i className="fas fa-pencil-alt"></i></a>
       <a href="#" title="Flip" className="btn btn-primary btn-sm" onClick={this.flipPath} role="button" aria-pressed="true"><i className="fas fa-flickr"></i></a>
       <a href="#" title="Download" className="btn btn-primary btn-sm" onClick={this.import} role="button" aria-pressed="true"><i className="fas fa-download"></i></a>
       <a href="#" title="Save" className={classNames("btn btn-primary btn-sm", {disabled:bones.length === 0 && paths.length === 0 && animaticonGroups.length === 0})} onClick={this.save} role="button" aria-pressed="true"><i className="far fa-save"></i></a>
       <a href="#" title="Export" className={classNames("btn btn-primary btn-sm", {disabled:!this.props.selectedGroup && !this.props.selectedPath})} onClick={this.exportToSVG} role="button" aria-pressed="true"><i className="fas fa-external-link-square-alt"></i></a>
       <a href="#" title="Delete All" className={classNames("btn btn-primary btn-sm")} onClick={this.clearAll} role="button" aria-pressed="true"><i className="fas fa-trash"></i></a>
       <ShapesModal/>
       <GlobalMessageModal/>
       <AnimaticonObjSetsModal/>
       <ImportObjModal/>
    </div>
  }

}

export default connect(
  state => ({
    animationControls:state.animation.controls,
    selectedGroup:state.app.selectedGroup,
    selectedPath:state.app.selectedPath,
    selectedSegment:state.app.selectedSegment,
    mainScene:state.app.mainScene,
    animaticonGroups:state.app.animaticonGroups,
    bones:state.app.bones || [],
    paths:state.app.paths || [],
    mainScene:state.app.mainScene
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions, globalActions), dispatch)
  })
)(PaperHeaderMenu);
