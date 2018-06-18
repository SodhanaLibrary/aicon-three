import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';

class PathPropertiesForm extends React.Component {
  constructor(props) {
    super(props);
    const pathProps = props.path ? props.path.getProperties() : {};
    this.state = Object.assign({}, pathProps, {
      open:true,
      wireframe:props.path ? props.path.path.material.wireframe : false,
      visible:props.path ? props.path.path.visible : true
    });
    this.handleChange = this.handleChange.bind(this);
    this.setProperties = this.setProperties.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleCheckboxChange(event) {
    if(event.target.name === 'wireframe') {
      this.props.path.path.material[event.target.name] = !this.props.path.path.material[event.target.name];
    } else if(event.target.name === 'showDots') {
      this.setState({
        showDots:!this.state.showDots
      });
    } else {
      this.setState({
        [event.target.name]:!this.state[event.target.name]
      });
    }
  }

  handleChange(event) {
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
      currentObj[fieldName] = event.target.value;
      this.setState({
       [mainModelName]:  obj
      });
    } else {
      this.setState({
       [event.target.name]:  event.target.value
      });
    }

    if(event.target.name === 'groupItemId') {
      const {selectedGroup, allPaths} = this.props;
      const paths = this.props.selectedGroup ? this.props.selectedGroup.getControls().paths : (allPaths ? allPaths : []);
      const path = paths.find(path => path.props.id === event.target.value);
      if(path) {
        const pathProps = path.getProperties();
        this.setState(Object.assign({}, pathProps));
      } else {
        this.setState({
          groupItemId:null
        });
      }
    }
  }


  setProperties(event) {
    event.preventDefault();
    const pathProps = Object.assign({}, this.state);
    delete pathProps.open;
    if(this.props.path) {
      this.props.path.setProps(pathProps);
    } else {
      const path = this.props.allPaths.find(path => path.props.id === this.state.groupItemId);
      path.setProps(pathProps);
    }
    return false;
  }

  render() {
    const {selectedGroup, selectedPath, allPaths} = this.props;
    const paths = selectedGroup ? selectedGroup.getControls().paths : (allPaths ? allPaths : []);
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">Path Properties</div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <form className="card-body--form" onSubmit={this.setProperties}>
        {!selectedPath && <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Segments</label>
          <div className="col-sm-7">
            <select className="custom-select" name="groupItemId" onChange={this.handleChange}>
               <option selected>Choose...</option>
               {paths.map(path => <option key={path.props.id} value={path.props.id}>{path.props.name}</option>)}
            </select>
          </div>
        </div>}
        {(this.state.groupItemId || selectedPath) && <div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-6 col-form-label">Material</label>
          <div className="col-sm-6 col-sm-bone-field">
            <input type="checkbox" className="form-control" name="wireframe" checked={this.state.material} onChange={this.handleCheckboxChange}/>Wireframe
            <input type="checkbox" className="form-control" name="showDots" checked={this.state.showDots} onChange={this.handleCheckboxChange}/>Show Dots
            <input type="checkbox" className="form-control" name="visible" checked={this.state.visible} onChange={this.handleCheckboxChange}/>Visible
          </div>
        </div>
         <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Id</label>
            <div className="col-sm-7">
              <input type="text" className="form-control" name="id" required={true} value={this.state.id} onChange={this.handleChange}/>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Name</label>
            <div className="col-sm-7">
              <input type="text" className="form-control" name="name" required={true} value={this.state.name} onChange={this.handleChange}/>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Z Index</label>
            <div className="col-sm-7">
              <input type="text" className="form-control" name="zIndex" required={true} value={this.state.zIndex} onChange={this.handleChange}/>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Fill Color</label>
            <div className="col-sm-7">
              <input type="text" className="form-control" name="fillColor" required={true} value={this.state.fillColor} onChange={this.handleChange}/>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Center (X,Y)</label>
            <div className="col-sm-3 col-sm-bone-field">
              <input type="text" className="form-control" name="position.x" required={true} value={this.state.position.x} onChange={this.handleChange}/>
            </div>
            <div className="col-sm-3 col-sm-bone-field">
              <input type="text" className="form-control" name="position.y" required={true} value={this.state.position.y} onChange={this.handleChange}/>
            </div>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-secondary">Set Properties</button>
          </div></div>}
        </form>}
      </div>
    </div>;
  }

}

export default connect(
  state => ({
    selectedGroup:state.app.selectedGroup,
    selectedPath:state.app.selectedPath,
    allPaths:state.app.paths
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(PathPropertiesForm);
