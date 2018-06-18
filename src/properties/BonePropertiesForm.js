import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';

class BonePropertiesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupItemId:null,
      open:true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.setProperties = this.setProperties.bind(this);
    this.updateModelValue = this.updateModelValue.bind(this);
    this.addBone = this.addBone.bind(this);
  }

  updateModelValue(event, checked) {
    const modelNames = event.target.name.split('.');
    if(modelNames.length > 1) {
      const fieldName = modelNames[modelNames.length - 1];
      const mainModelName = modelNames[0];
      const obj = Object.assign({}, this.state[mainModelName]);
      modelNames.splice(0, 1);
      modelNames.splice(modelNames.length - 1, 1);
      let currentObj = obj;
      modelNames.forEach(mname => {
        currentObj = currentObj[mname];
      });
      currentObj[fieldName] = checked ?  event.target.checked : event.target.value;
      this.setState({
       [mainModelName]:  obj
      });
    } else {
      this.setState({
       [event.target.name]: checked ?  event.target.checked : event.target.value
      });
    }
  }

  handleChange(event) {
    this.updateModelValue(event);
    if(event.target.name === 'groupItemId') {
      const {selectedGroup} = this.props;
      const bones = selectedGroup ? selectedGroup.getControls().bones : [];
      const bone = bones.find(bone => bone.props.id === event.target.value);
      if(bone) {
        const boneProps = bone.getProperties();
        this.setState(Object.assign({}, boneProps, {
          bones:boneProps.bones.join(','),
          paths:boneProps.paths.join(',')
        }));
      } else {
        this.setState({
          groupItemId:null
        });
      }
    }
  }

  handleCheckboxChange(event) {
    this.updateModelValue(event, true);
  }

  setProperties(event) {
    event.preventDefault();
    const props = {
      id:this.state.id,
      length:parseFloat(this.state.length),
      initAngle:parseFloat(this.state.initAngle),
      name:this.state.name,
      muscleWidth:{
        start:parseInt(this.state.muscleWidth.start),
        end:parseInt(this.state.muscleWidth.end)
      },
      zIndex:parseInt(this.state.zIndex),
      fillColor:this.state.fillColor,
      joints:{
        start:{
          radius:parseInt(this.state.joints.start.radius),
          strokeWidth:parseInt(this.state.joints.start.strokeWidth),
          strokeColor:this.state.joints.start.strokeColor
        },
        end:{
          radius:parseInt(this.state.joints.end.radius),
          strokeWidth:parseInt(this.state.joints.end.strokeWidth),
          strokeColor:this.state.joints.end.strokeColor
        }
      },
      border:{
        strokeColor:this.state.border.strokeColor,
        strokeWidth:parseInt(this.state.border.strokeWidth)
      },
      arc:{
        start:this.state.arc.start,
        end:this.state.arc.end
      },
      bones:this.state.bones === '' ? [] : this.state.bones.split(','),
      paths:this.state.paths.length === 0 ? [] : this.state.paths.split(',')
    };
    const bones = this.props.selectedGroup ? this.props.selectedGroup.getControls().bones : [];
    const bone = bones.find(bone => bone.props.id === this.state.groupItemId);
    bone.setProps(props);
    const objMap = {};
    this.props.paths.forEach(path => objMap[path.props.id] = path);
    bone.paths = [];
    props.paths.forEach(path => {
      if(objMap[path]) {
        bone.addPath(objMap[path]);
      }
    });
    return false;
  }

  addBone() {
    const newBone = this.props.selectedGroup.addBone();
    const bone3 = this.props.bones.find(bone => bone.props.id === this.state.groupItemId);
    bone3.addBone(newBone);
    bone3.bone.updateMatrix();
    this.props.actions.addBone(newBone);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedGroup && nextProps.selectedGroup !== this.props.selectedGroup) {
      const bones = nextProps.selectedGroup ? nextProps.selectedGroup.getControls().bones : [];
      const bone = bones.find(bone => bone.props.id === this.state.groupItemId);
      if(bone) {
        const boneProps = bone.getProperties();
        this.setState(Object.assign({}, boneProps, {
          bones:boneProps.bones.join(','),
          paths:boneProps.paths.join(',')
        }));
      } else {
        this.setState({
          groupItemId:null
        });
      }
    }
  }

  render() {
    const {selectedGroup} = this.props;
    const bones = selectedGroup ? selectedGroup.getControls().bones : [];
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">Bone Properties</div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <form className="card-body--form" onSubmit={this.setProperties}>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Segments</label>
            <div className="col-sm-7">
              <select className="custom-select" name="groupItemId" onChange={this.handleChange}>
                 <option selected>Choose...</option>
                 {bones.map(bone => <option key={bone.props.id} value={bone.props.id}>{bone.props.name}</option>)}
              </select>
            </div>
          </div>
          {this.state.groupItemId && <div>
            <div className="form-group row">
              <div className="col-sm-12">
                <button onClick={this.addBone} type="submit" className="btn btn-secondary">Add Bone</button>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-6 col-form-label">Arcs</label>
              <div className="col-sm-3 col-sm-bone-field">
                <input type="checkbox" className="form-control" name="arc.start" checked={this.state.arc.start} onChange={this.handleCheckboxChange}/> Start
              </div>
              <div className="col-sm-3 col-sm-bone-field">
                <input type="checkbox" className="form-control" name="arc.end" checked={this.state.arc.end} onChange={this.handleCheckboxChange}/> End
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Id</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="id" required={true} value={this.state.id} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Name</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="name" required={true} value={this.state.name} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Muscle Width Start</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="muscleWidth.start" required={true} value={this.state.muscleWidth.start} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Muscle Width End</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="muscleWidth.end" required={true} value={this.state.muscleWidth.end} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Z Index</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="zIndex" required={true} value={this.state.zIndex} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Fill Color</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="fillColor" required={true} value={this.state.fillColor} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Length</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="length" required={true} value={this.state.length} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Init Angle</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="initAngle" required={true} value={this.state.initAngle} onChange={this.handleChange}/>
              </div>
            </div>
            {!this.state.arc.start && <div>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Joint1 Radius</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" name="joints.start.radius" required={true} value={this.state.joints.start.radius} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Joint1 Stroke Width</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" name="joints.start.strokeWidth" required={true} value={this.state.joints.start.strokeWidth} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Joint1 Stroke Color</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" name="joints.start.strokeColor" required={true} value={this.state.joints.start.strokeColor} onChange={this.handleChange}/>
                </div>
              </div>
            </div>}
            {!this.state.arc.end && <div>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Joint2 Radius</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" name="joints.end.radius" required={true} value={this.state.joints.end.radius} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Joint2 Stroke Width</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" name="joints.end.strokeWidth" required={true} value={this.state.joints.end.strokeWidth} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Joint2 Stroke Color</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" name="joints.end.strokeColor" required={true} value={this.state.joints.end.strokeColor} onChange={this.handleChange}/>
                </div>
              </div>
            </div>}
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Border Stroke Color</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="border.strokeColor" required={true} value={this.state.border.strokeColor} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Border Stroke Width</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="border.strokeWidth" required={true} value={this.state.border.strokeWidth} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Bones</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="bones" value={this.state.bones} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-7 col-form-label">Paths</label>
              <div className="col-sm-5">
                <input type="text" className="form-control" name="paths" value={this.state.paths} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-secondary">Set Properties</button>
            </div>
          </div>}

        </form>}
      </div>
    </div>;
  }

}

export default connect(
  state => ({
    selectedGroup:state.app.selectedGroup,
    paths:state.app.paths,
    bones:state.app.bones
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(BonePropertiesForm);
