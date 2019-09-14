

import {combineReducers} from 'redux'
import defaultState from './state'
// 左边菜单改变
function leftNav(state=defaultState.leftNav,action){
    switch(action.type){
        case 'SET_LEFT_NAV':
            return action.data
        default :return state
    }
}
// 登陆的用户的信息
function userId(state=defaultState.userId,action){
    switch(action.type){
        case 'SET_USER_OBJ':
        return action.data
        default :return state
    }
}




// 一个reducer就是一个函数
function pageTitle (state = defaultState.pageTitle, action) {
    // 不同的action有不同的处理逻辑
    switch (action.type) {
      case 'SET_PAGE_TITLE':
        return  action.data
      default:
        return state
    }
  }


  // 静态 图片路径   
  function imgUrl(state=defaultState.imgUrl,action){
    switch(action.type){
        case 'GET_IMGURL':
        return action.data
        default:
       return state
    }
  }
  //   静态 请求路径
  function baseUrl(state=defaultState.baseUrl,action){
      switch(action.type){
          case 'GET_BASEURL':
          return action.data
          default:
         return state
      }
  }
  // 订单详情
  function orderDetail(state=defaultState.orderDetail,action){
    switch(action.type){
      case 'GET_ORDER_DETAIL':
      return action.data
      default :
      return state
    }
  }
export default combineReducers({
    pageTitle,imgUrl,baseUrl,leftNav,userId
})