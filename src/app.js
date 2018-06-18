import React from 'react';
import PaperView from './paperView/PaperView';
import * as appActions from './actions/appActions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ObjectSearchPanel from './panels/ObjectSearchPanel';
import BannerSearchPanel from './panels/BannerSearchPanel';
import PaperHeaderMenu from './header/PaperHeaderMenu';
import AnimationPanel from './panels/AnimationPanel';
import OptionsPanel from './panels/OptionsPanel';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="body_content">
        <div className="body_content--left-panel">
          <BannerSearchPanel/>
          <ObjectSearchPanel/>
        </div>
        <div className="body_content--right-panel">
            <div className="body_content__tab">
              <PaperHeaderMenu/>
              <div className="body_content__tab--info">
                 X : <span id="canvas_point_x"></span>, Y : <span id="canvas_point_y"></span>
              </div>
            </div>
            <PaperView ref={(ref) => this.paperView = ref}/>
            <AnimationPanel/>
        </div>
        <div className="body_content--controls" id="group-controls">
         <OptionsPanel/>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    selectedGroup:state.selectedGroup
  }),
  dispatch => ({
    actions: bindActionCreators(appActions, dispatch)
  })
)(App);
