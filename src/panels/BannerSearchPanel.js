import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import * as searchActions from '../actions/searchActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CommonSVG from '../common/CommonSVG';
import config from '../../config/appConfig';
import Utils from '../common/Utils';
import testData from '../common/testData';

class BannerSearchPanel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      open:false
    }
    this.addAnimaticonGroup = this.addAnimaticonGroup.bind(this);
    this.formGroupAnimationControl = this.formGroupAnimationControl.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  search(event) {
    return false;
  }

  async init() {
    const results = await Utils.apiFetch('SEARCH_ANIMATICON_BANNERS', {
      q:''
    });
    this.props.actions.setBannersSearchResults(results);
  }

  addAnimaticonGroup(res) {
    const mainGroup = new THREE.Group();
    const segs = JSON.parse(res.objJson);
    const groups = segs.groups.map(group => {
      group.scene = this.props.scene;
      const obj = new window.animaticonObjects.AnimaticonObj3(group);
      this.props.actions.addAnimaticonGroup(obj);
      mainGroup.add(obj.group);
      return obj;
    });
    const paths = segs.paths.map(path => {
      path.scene = this.props.scene;
      const obj = new window.animaticonObjects.PathObj3(path);
      this.props.actions.addPath(obj);
      mainGroup.add(obj.path);
      return obj;
    });
    let box = new THREE.Box3().setFromObject(mainGroup);
    if(box.max.x - box.min.x > this.props.size.width ) {
      let factor = this.props.size.width / (box.max.x - box.min.x);
      factor -= 0.1;
      mainGroup.scale.set(factor, factor, 1);
      box = new THREE.Box3().setFromObject(mainGroup);
    }

    if(box.max.y - box.min.y > this.props.size.height ) {
      let factor = this.props.size.height / (box.max.y - box.min.y);
      factor -= 0.1;
      mainGroup.scale.set(factor, factor, 1);
      box = new THREE.Box3().setFromObject(mainGroup);
    }

    this.props.scene.add(mainGroup);
    segs.controls.forEach(cntrl => {
      const prps = Object.assign({}, cntrl, {
        group:groups.find(gr => gr.groupId === cntrl.groupId),
        translatePath:paths.find(pt => pt.props.id === cntrl.pathItem)
      });
      let ncontrol;
      if(cntrl.animationControlClass === 'GroupAnimationControls3') {
        ncontrol = this.formGroupAnimationControl(cntrl.controls, groups, paths)
      } else {
        ncontrol = new window.animaticonObjects[cntrl.animationControlClass](prps);
      }
      this.props.actions.addAnimationControl(ncontrol);
    });
    this.props.actions.setCurrentBanner(res);
  }

  formGroupAnimationControl(controls, groups, paths) {
    const {selectedGroup} = this.props;
    const rcontrols = controls.map(cntrl => {
      const prps = Object.assign({}, cntrl, {
        group:groups.find(gr => gr.groupId === cntrl.groupId),
        translatePath:paths.find(pt => pt.props.id === cntrl.pathItem)
      });
      let ncontrol;
      if(cntrl.animationControlClass === 'GroupAnimationControls3') {
        ncontrol = this.formGroupAnimationControl(cntrl.controls, groups, paths)
      } else {
        ncontrol = new window.animaticonObjects[cntrl.animationControlClass](prps);
      }
      return ncontrol;
    });
    const gac = new window.animaticonObjects.GroupAnimationControls3({group:selectedGroup});
    gac.setControls(rcontrols);
    return gac;
  }

  render() {
    const {searchResults} = this.props;
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">Banners</div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <form>
          <div className="form-group">
              <input type="search" name="search" className="form-control form-control-sm" value=""/>
          </div>
          <div className="search-panel">
            {searchResults && searchResults.map((res, i) => <div key={i} onClick={() => this.addAnimaticonGroup(res)} className="search-panel-item search-panel-item--banner">
             <img src={res.img} alt={res.name} className="search-panel-item_img"/>
            </div>)}
          </div>
        </form>}
      </div></div>;
  }
}

export default connect(
  state => ({
    searchResults:state.search.bannersSearchResults,
    scene:state.app.mainScene,
    size:state.app.size
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, animationActions, appActions, searchActions), dispatch)
  })
)(BannerSearchPanel);
