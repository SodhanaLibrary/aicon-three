import React from 'react';
import * as appActions from '../actions/appActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import BonePropertiesForm from './BonePropertiesForm';
import PathPropertiesForm from './PathPropertiesForm';

class SelectedGroupProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false
    }
  }

  render() {
    const {selectedGroup} = this.props;
    const controls = selectedGroup ? selectedGroup.getControls() : {};
    return <div>
        <div className="card">
          <div className="card-body">
            <div className="card-body--title">
              <div className="card-title">Group properties</div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
            </div>
            {this.state.open && <form className="card-body--form" onSubmit={this.setProperties}>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Name</label>
                <div className="col-sm-7">
                  {controls.name}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Animaticon Name</label>
                <div className="col-sm-7">
                  {controls.animaticonObjName}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-5 col-form-label">Tags</label>
                <div className="col-sm-7">
                  {controls.tags}
                </div>
              </div>
            </form>}
          </div>
        </div>
        <BonePropertiesForm/>
      </div>;
  }
}

export default connect(
  state => ({
    selectedGroup:state.app.selectedGroup
  }),
  dispatch => ({
    actions: bindActionCreators(appActions, dispatch)
  })
)(SelectedGroupProperties);
