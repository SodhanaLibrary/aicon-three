import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DivPropertiesForm extends React.Component {
  constructor(props) {
    super(props);
    const prps = props.selectedDiv ? props.selectedDiv : {};
    this.state = Object.assign({}, prps, {
      open:true
    });
    this.handleChange = this.handleChange.bind(this);
    this.setProperties = this.setProperties.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleCheckboxChange(event) {
    this.setState({
      [event.target.name]:!this.state[event.target.name]
    });
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
  }


  setProperties(event) {
    const {style, text} = this.state;
    event.preventDefault();
    this.props.actions.removeDiv(this.props.selectedDiv);
    const dv = Object.assign(this.props.selectedDiv, {style, text});
    this.props.actions.setSelectedDiv(dv);
    this.props.actions.addDiv(dv);
    return false;
  }

  render() {
    const {selectedDiv} = this.props;
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">Path Properties</div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <form className="card-body--form" onSubmit={this.setProperties}>
        {selectedDiv && <div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Text</label>
            <div className="col-sm-7">
              <textarea type="text" className="form-control form-control-sm" name="text" required={true} value={this.state.text} onChange={this.handleChange}/>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Style</label>
            <div className="col-sm-7">
              <textarea style={{height:'222px'}} type="text" className="form-control form-control-sm" name="style" required={true} value={this.state.style} onChange={this.handleChange}/>
            </div>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-secondary btn-sm">Set Properties</button>
          </div></div>}
        </form>}
      </div>
    </div>;
  }

}

export default connect(
  state => ({
    selectedDiv:state.app.selectedDiv,
    divs:state.app.divs
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, appActions, animationActions), dispatch)
  })
)(DivPropertiesForm);
