import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import config from '../../config/appConfig';
import classNames from 'classnames';
import Utils from '../common/Utils';
import {ButtonGroup, MenuItem, DropdownButton, Button} from 'react-bootstrap';

class PreDefinedAnimationControlSets extends React.Component{
  constructor(props){
    super(props);
    this.addAnimations = this.addAnimations.bind(this);
    this.addAllSeperateAnimations = this.addAllSeperateAnimations.bind(this);
    this.loadPreDefinedAnimations = this.loadPreDefinedAnimations.bind(this);
    this.formGroupAnimationControl = this.formGroupAnimationControl.bind(this);
    this.state = {
      open:false
    }
  }

  componentWillMount() {
    this.loadPreDefinedAnimations(this.props.selectedGroup);
  }

  async loadPreDefinedAnimations(selectedGroup) {
    const res = await Utils.apiFetch("GET_PRE_DEFINED_ANIMATION_CONTROLS", {
      animaticonObjName:selectedGroup.animaticonObjName
    });
    this.props.actions.setPreDefinedAnimationControlSets({
      animaticonObjName:selectedGroup.animaticonObjName,
      animationControlSets:res
    });
  }

  addAnimations(aset) {
    let controls = JSON.parse(aset.objJson);
    this.props.actions.addAnimationControl(this.formGroupAnimationControl(controls));
  }

  formGroupAnimationControl(controls) {
    const {selectedGroup} = this.props;
    const rcontrols = controls.map(cntrl => {
      const prps = Object.assign({}, cntrl, {
        group:selectedGroup
      });
      let ncontrol;
      if(cntrl.animationControlClass === 'GroupAnimationControls') {
        ncontrol = this.formGroupAnimationControl(cntrl.controls)
      } else {
        ncontrol = new window.animaticonObjects[cntrl.animationControlClass](prps);
      }
      return ncontrol;
    });
    const gac = new window.animaticonObjects.GroupAnimationControls3({group:selectedGroup});
    gac.setControls(rcontrols);
    return gac;
  }

  addAllSeperateAnimations(aset) {
    const {selectedGroup} = this.props;
    let controls = JSON.parse(aset.objJson);
    controls = controls.map(cntrl => {
      const prps = Object.assign({}, cntrl, {
        group:selectedGroup
      });
    return new window.animaticonObjects[cntrl.animationControlClass](prps)});
    this.props.actions.addAnimationControls(controls);
  }

  async deleteAnimations(aset) {
    const res = await Utils.apiFetch("DELETE_PRE_DEFINED_ANIMATION_CONTROL", {
      uuid:aset.uuid
    });
    this.loadPreDefinedAnimations(this.props.selectedGroup);
  }

  componentWillReceiveProps(nextProps) {
    const {preDefindeAnimations, selectedGroup} = this.props;
    if(nextProps.selectedGroup !== this.props.selectedGroup) {
      const preControls = preDefindeAnimations[nextProps.selectedGroup.animaticonObjName] || 0;
      if(nextProps.selectedGroup !== selectedGroup && preControls.length === 0) {
        this.loadPreDefinedAnimations(nextProps.selectedGroup);
      }
    }
  }

  render() {
    const {preDefindeAnimations, selectedGroup} = this.props;
    const animationControlSet = selectedGroup ? preDefindeAnimations[selectedGroup.animaticonObjName] : [];
    return animationControlSet && animationControlSet.length > 0 ? <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">Pre defined animations</div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <table className="table table-hover pre-defined-animation-controls-table">
          <tbody>
            {animationControlSet.map(aset => <tr key={aset.uuid}>
              <td>{aset.name}</td>
              <td className="pre-defined-animation-controls-table__btns">
                <ButtonGroup  className="pull-right">
                  <DropdownButton title={<i className="fas fa-cog"></i>} id="bg-nested-dropdown">
                    <MenuItem onSelect={() => this.addAnimations(aset)} className="dropdown-item" eventKey="1">Add</MenuItem>
                    <MenuItem onSelect={() => this.addAllSeperateAnimations(aset)} className="dropdown-item" eventKey="1">Add all seperate</MenuItem>
                    <MenuItem onSelect={() => this.deleteAnimations(aset)} className="dropdown-item" eventKey="2">Delete</MenuItem>
                  </DropdownButton>
                </ButtonGroup>
              </td>
            </tr>)}
          </tbody>
        </table>}
      </div>
    </div> : null;
  }
}

export default connect(
  state => ({
    selectedGroup:state.app.selectedGroup,
    preDefindeAnimations:state.animation.preDefinedAnimationControlSets,
  }),
  dispatch => ({
    actions: bindActionCreators(animationActions, dispatch)
  })
)(PreDefinedAnimationControlSets);
