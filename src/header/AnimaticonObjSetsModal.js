import React from 'react';
import * as appActions from '../actions/appActions'
import * as apiActions from '../actions/appActions'
import * as globalActions from '../actions/globalActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CommonSVG from '../common/CommonSVG';
import config from '../../config/appConfig';
import classNames from 'classnames';
import {Modal, Button} from 'react-bootstrap';
import Utils from '../common/Utils';


class AnimaticonObjSetsModal extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name:'',
      tags:'',
      uuid:'',
      animaticonObjName:'',
      animaticonBannerName:'',
      img:'',
      position:{
        x:0,
        y:0,
        z:0
      },
      scale:{
        x:1,
        y:1,
        z:1
      }
    };
    this.handleClose = this.handleClose.bind(this);
    this.saveAnimaticonObjsSet = this.saveAnimaticonObjsSet.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.previewFile = this.previewFile.bind(this);
    this.updateCurrentGroup = this.updateCurrentGroup.bind(this);
    this.saveAsBanner = this.saveAsBanner.bind(this);
    this.updateCurrentBanner = this.updateCurrentBanner.bind(this);
  }

  handleChange(event) {
    this.setState({
    [event.target.name]:  event.target.value
    });
  }

  async updateCurrentGroup(event) {
    event.preventDefault();
    const {uuid, name, tags, img, animaticonObjName, position, scale} = this.state;
    const subObj = {uuid, name, tags, animaticonObjName, img,
      objJson:JSON.stringify({
        bones:this.props.bones.filter(bone => bone.props.id).map(bone => bone.getProperties()),
        paths:this.props.paths.filter(path => path.props.id).map(path => path.getProperties()),
        position,
        scale
      })
    };
    await Utils.apiFetch("PUT_ANIMATICON_OBJS", subObj);
    this.handleClose();
    return false;
  }

  previewFile(event) {
     const file = event.target.files[0]
     var reader  = new FileReader();
     reader.onloadend = () => {
         this.setState({
           img:reader.result
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
    this.props.actions.showHideAnimaticonObjSetsModal(false);
  }

  async saveAnimaticonObjsSet(event) {
    const {currentBanner} = this.props;
    event.preventDefault();
    let subObj = {};
    if(currentBanner) {
      const {name, tags, animaticonObjName, position, scale} = this.props.animaticonGroups[0].getProperties();
      subObj = {name, tags, animaticonObjName,
        objJson:JSON.stringify({
          bones:this.props.animaticonGroups[0].bones.filter(bone => bone.props.id).map(bone => bone.getProperties()),
          paths:this.props.animaticonGroups[0].paths.filter(path => path.props.id).map(path => path.getProperties()),
          position,
          scale
        })
      };
      subObj.img = this.state.img;
    } else {
      const {name, tags, img, animaticonObjName, position, scale} = this.state;
      subObj = {name, tags, animaticonObjName, img,
        objJson:JSON.stringify({
          bones:this.props.bones.filter(bone => bone.props.id).map(bone => bone.getProperties()),
          paths:this.props.paths.filter(path => path.props.id).map(path => path.getProperties()),
          position,
          scale
        })
      };
    }
    await Utils.apiFetch("POST_ANIMATICON_OBJS", subObj);
    this.handleClose();
  }

  async saveAsBanner(event) {
    event.preventDefault();
    const {name, tags, img, animaticonBannerName} = this.state;
    Utils.changeImageSize({
      imgUrl:img,
      maxWidth:220,
      maxHeight:110
    }).then(response => {
      let groupId = 1;
      this.props.animaticonGroups.forEach(group => {
        group.setGroupId(groupId);
        groupId = groupId + 1;
      });
      const subObj = {name, tags, animaticonBannerName, img:response,
        objJson:JSON.stringify({
          groups:this.props.animaticonGroups.map(group => {
            const props = group.getProperties();
            delete props.img;
            return props;
          }),
          paths:this.props.paths.filter(path => !path.group).map(path => path.getProperties()),
          controls:this.props.animationControls.map(control => control.toJson())
        })
      };
      Utils.apiFetch("POST_ANIMATICON_BANNERS", subObj);
    });
    this.handleClose();
  }

  updateCurrentBanner(event) {
    event.preventDefault();
    const {name, tags, img, animaticonBannerName, uuid} = this.state;
    Utils.changeImageSize({
      imgUrl:img,
      maxWidth:220,
      maxHeight:110
    }).then(response => {
      let groupId = 1;
      this.props.animaticonGroups.forEach(group => {
        group.setGroupId(groupId);
        groupId = groupId + 1;
      });
      const subObj = {uuid, name, tags, animaticonBannerName, img:response,
        objJson:JSON.stringify({
          groups:this.props.animaticonGroups.map(group => {
            const props = group.getProperties();
            delete props.img;
            return props;
          }),
          paths:this.props.paths.map(path => path.getProperties()),
          controls:this.props.animationControls.map(control => control.toJson())
        })
      };
      Utils.apiFetch("PUT_ANIMATICON_BANNERS", subObj);
    });
    this.handleClose();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.currentBanner) {
      const {uuid, name, tags, img, animaticonBannerName} = nextProps.currentBanner;
      if(nextProps.currentBanner.uuid !== this.state.uuid) {
        this.setState({uuid, name, tags, img, animaticonBannerName});
      }
    } else if(nextProps.animaticonGroups.length === 1) {
      const cgroup = nextProps.animaticonGroups[0];
      const {uuid, name, tags, img, animaticonObjName, position, scale} = cgroup.getProperties();
      if(cgroup.uuid !== this.state.uuid) {
        this.setState({uuid, name, tags, img, animaticonObjName, position, scale});
      } else {
        this.setState({position, scale});
      }
    }
  }

  render() {
    const {currentBanner, animaticonGroups} = this.props;
    return <Modal show={this.props.showAnimaticonObjSetsModal} onHide={this.handleClose}>
              <div className="modal-header">
                <h5 className="modal-title">Animaticon Object</h5>
                <button type="button" className="close" onClick={this.handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.saveAnimaticonObjsSet}>
                  <div className="form-group row">
                    <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Name</label>
                    <div className="col-sm-8">
                      <input required={true} type="text" className="form-control form-control-sm" name="name" required={true} value={this.state.name} onChange={this.handleChange}/>
                    </div>
                  </div>
                  {(!currentBanner && animaticonGroups.length === 1) ? <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Animaticon Object Name</label>
                    <div className="col-sm-8">
                      <input required={true} type="text" name="animaticonObjName" className="form-control form-control-sm" required={true} value={this.state.animaticonObjName} onChange={this.handleChange}/>
                    </div>
                  </div> : <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Animaticon Banner Name</label>
                    <div className="col-sm-8">
                      <input required={true} type="text" name="animaticonBannerName" className="form-control form-control-sm" required={true} value={this.state.animaticonBannerName} onChange={this.handleChange}/>
                    </div>
                  </div>}
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Tags</label>
                    <div className="col-sm-8">
                      <input required={true} type="text" name="tags" className="form-control form-control-sm" required={true} value={this.state.tags} onChange={this.handleChange}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Upload image</label>
                    <div className="col-sm-8">
                      <input required={true} type="file" onChange={this.previewFile}/> <br/>
                      <img src={this.state.img} className="modal-body-img-preview"/>
                    </div>
                  </div>
                  <div className="form-group modal-footer--buttons">
                    {(this.props.animaticonGroups.length === 1 && !currentBanner) && <button onClick={this.updateCurrentGroup} className="btn btn-secondary btn-sm">Update current group</button>}
                    {(this.props.animaticonGroups.length > 1) && <button onClick={this.saveAsBanner} className="btn btn-secondary btn-sm">Create Banner</button>}
                    {currentBanner && <button onClick={this.updateCurrentBanner} className="btn btn-secondary btn-sm">Update Current Banner</button>}
                    <button type="submit" className="btn btn-secondary btn-sm">Create new group</button>
                  </div>
                </form>
              </div>
            </Modal>;
  }
}

export default connect(
  state => ({
    currentBanner:state.app.currentBanner,
    animaticonGroups:state.app.animaticonGroups,
    showAnimaticonObjSetsModal:state.global.showAnimaticonObjSetsModal,
    bones:state.app.bones || [],
    paths:state.app.paths || [],
    animationControls:state.animation.controls
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, globalActions), dispatch)
  })
)(AnimaticonObjSetsModal);
