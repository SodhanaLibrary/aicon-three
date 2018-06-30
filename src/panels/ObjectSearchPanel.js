import React from 'react';
import * as appActions from '../actions/appActions';
import * as animationActions from '../actions/animationActions';
import * as searchActions from '../actions/searchActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CommonSVG from '../common/CommonSVG';
import config from '../../config/appConfig';
import Utils from '../common/Utils';
import testData from '../common/testData';

class ObjectSearchPanel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      open:true
    }
    this.addAnimaticonGroup = this.addAnimaticonGroup.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  search(event) {
    return false;
  }

  async init() {
    const results = await Utils.apiFetch('SEARCH_ANIMATICON_OBJS', {
      q:''
    });
    this.props.actions.setObjectsSearchResults(results);
  }

  addAnimaticonGroup(res) {
      res.scene = this.props.mainScene;
      const obj = new window.animaticonObjects.AnimaticonObj3(res);
      this.props.actions.addAnimaticonGroup(obj);
      this.props.actions.setSelectedGroup(obj);
      this.props.actions.setSelectedAnimationControl(null);
      this.props.actions.addBones(obj.bones);
      this.props.actions.addPaths(obj.paths);
  }

  render() {
    const {searchResults} = this.props;
    return <div className="card">
      <div className="card-body">
        <div className="card-body--title">
          <div className="card-title">Objects</div><span onClick={() => this.setState({open:!this.state.open})} className="fas fa-angle-down"></span>
        </div>
        {this.state.open && <form>
          <div className="form-group">
              <input type="search" name="search" className="form-control form-control-sm" value=""/>
          </div>
          <div className="search-panel">
            {searchResults && searchResults.map((res, i) => <div key={i} onClick={() => this.addAnimaticonGroup(res)} className="search-panel-item">
             <img src={res.img} alt={res.name} className="search-panel-item_img"/>
            </div>)}
          </div>
        </form>}
      </div></div>;
  }
}

export default connect(
  state => ({
    searchResults:state.search.objectsSearchResults,
    mainScene:state.app.mainScene
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, animationActions, appActions, searchActions), dispatch)
  })
)(ObjectSearchPanel);
