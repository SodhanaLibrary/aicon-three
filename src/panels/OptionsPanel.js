import React from 'react';
import * as appActions from '../actions/appActions'
import * as animationActions from '../actions/animationActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CommonSVG from '../common/CommonSVG';
import config from '../../config/appConfig';
import classNames from 'classnames';
import SelectedGroupControls from '../controls/SelectedGroupControls';
import RotateAnimationControlForm from '../controls/RotateAnimationControlForm';
import SelectedGroupProperties from '../properties/SelectedGroupProperties';
import PathPropertiesForm from '../properties/PathPropertiesForm';
import DivPropertiesForm from '../properties/DivPropertiesForm';

class OptionsPanel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selectedTab:1
    }
  }

  selectTab(key) {
    this.setState({
      selectedTab:key
    });
  }

  render() {
    const {selectedGroup, selectedPath, bones, paths, selectedDiv} = this.props;
    return <div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a onClick={() => this.selectTab(1)} className={classNames("nav-link", {"active":this.state.selectedTab === 1})}>Controls</a>
          </li>
          <li className="nav-item">
            <a onClick={() => this.selectTab(2)} className={classNames("nav-link", {"active":this.state.selectedTab === 2})}>Properties</a>
          </li>
        </ul>
         {this.state.selectedTab === 1 && <SelectedGroupControls/>}
         {this.state.selectedTab === 2 && selectedGroup && <SelectedGroupProperties/>}
         {this.state.selectedTab === 2 && selectedPath && <PathPropertiesForm path ={selectedPath}/>}
         {this.state.selectedTab === 2 && selectedDiv && <DivPropertiesForm/>}
        </div>;
  }
}

export default connect(
  state => ({
    selectedGroup:state.app.selectedGroup,
    selectedPath:state.app.selectedPath,
    selectedDiv:state.app.selectedDiv,
    bones:state.app.bones,
    paths:state.app.paths
  }),
  dispatch => ({
    actions: bindActionCreators(appActions, dispatch)
  })
)(OptionsPanel);
