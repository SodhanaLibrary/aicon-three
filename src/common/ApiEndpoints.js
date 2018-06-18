import Utils from './Utils';
import config from '../../config/appConfig';

export default {
  POST_ANIMATION_CONTROLS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    url: config.apiGatewayHost + '/animation/controls',
    actionType:"api@fe/POST_ANIMATION_CONTROLS"
  },
  GET_PRE_DEFINED_ANIMATION_CONTROLS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    url: config.apiGatewayHost + '/animation/controls',
    actionType:"api@fe/GET_PRE_DEFINED_ANIMATION_CONTROLS"
  },
  DELETE_PRE_DEFINED_ANIMATION_CONTROL: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'delete',
    url: config.apiGatewayHost + '/animation/controls',
    actionType:"api@fe/DELETE_PRE_DEFINED_ANIMATION_CONTROL"
  },


  POST_ANIMATICON_OBJS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    url: config.apiGatewayHost + '/animaticon/objs',
    actionType:"api@fe/POST_ANIMATICON_OBJS"
  },
  GET_ANIMATICON_OBJS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    url: config.apiGatewayHost + '/animaticon/objs',
    actionType:"api@fe/GET_ANIMATICON_OBJS"
  },
  SEARCH_ANIMATICON_OBJS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    url: config.apiGatewayHost + '/animaticon/search',
    actionType:"api@fe/SEARCH_ANIMATICON_OBJS"
  },
  DELETE_ANIMATICON_OBJS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'delete',
    url: config.apiGatewayHost + '/animaticon/objs',
    actionType:"api@fe/DELETE_ANIMATICON_OBJS"
  },
  PUT_ANIMATICON_OBJS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put',
    url: config.apiGatewayHost + '/animaticon/objs',
    actionType:"api@fe/PUT_ANIMATICON_OBJS"
  },


  POST_ANIMATICON_BANNERS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    url: config.apiGatewayHost + '/animaticonBanner/banners',
    actionType:"api@fe/POST_ANIMATICON_BANNERS"
  },
  GET_ANIMATICON_BANNERS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    url: config.apiGatewayHost + '/animaticonBanner/banners',
    actionType:"api@fe/GET_ANIMATICON_BANNERS"
  },
  SEARCH_ANIMATICON_BANNERS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get',
    url: config.apiGatewayHost + '/animaticonBanner/search',
    actionType:"api@fe/SEARCH_ANIMATICON_BANNERS"
  },
  DELETE_ANIMATICON_BANNERS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'delete',
    url: config.apiGatewayHost + '/animaticonBanner/banners',
    actionType:"api@fe/DELETE_ANIMATICON_BANNERS"
  },
  PUT_ANIMATICON_BANNERS: {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put',
    url: config.apiGatewayHost + '/animaticonBanner/banners',
    actionType:"api@fe/PUT_ANIMATICON_BANNERS"
  }
};
