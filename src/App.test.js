
//  Store 就是把它们联系到一起的对象。Store 有以下职责：

//  维持应用的 state；
//  提供 getState() 方法获取 state；
//  提供 dispatch(action) 方法更新 state；
//  通过 subscribe(listener) 注册监听器;
//  通过 subscribe(listener) 返回的函数注销监听器。

//  // Dispatch some actions
//  store.dispatch(addTodo('Learn about actions'))
//  store.dispatch(addTodo('Learn about reducers'))
//  store.dispatch(addTodo('Learn about store'))
// redux 小例子
/**
 * |--src
    |-- store                 Redux目录
        |-- actions.js
        |-- index.js
        |-- reducers.js
        |-- state.js
    |-- components      组件目录
        |-- Test.jsx
    |-- App.js               项目入口
 */


//将state的默认值统一放置在state.js文件
/** 第一步：：：：：：：：：：：：：：：
 *  state.js
 * 声明默认值
 * 这里我们列举两个示例
 * 同步数据：pageTitle
 * 异步数据：infoList（将来用异步接口获取）
 */

export default {
  pageTitle: "首页",
  infoLIstanbul: []
}

/**第二步：：：：：：：：：：：：：：：
 * 创建reducer，他就是将来真正要用到的数据】
 * reducers.js
 */
import {
  combineReducers
} from 'redux'
//默认值
import defaultState from './state.js'
// 一个reducer就是一个函数
function pageTitle(state = defaultState, action) {
  // 不同的action有不同的处理逻辑
  switch (action.type) {
    case 'SET_PAGE_TITLE':
      return action.data
    default:
      return state
  }
}

function infoList (state = defaultState.infoList, action) {
  switch (action.type) {
    case 'SET_INFO_LIST':
      return action.data
    default:
      return state
  }
}
//导出所有的reducer
export default combineReducers({pageTitle,infoList})

/**
 * 第三步：创建action。现在我们已经创建了reducer，但是还没有对应的action来操作它们，所以接下来就来编写action
 * action.js
 * action 也是函数
 */
//静态数据的action 
export function setPageTitle(data){
  return (dispatch,getState)=>{
    dispatch({type:'GET_PAGE_TITLE',data:data})
  }
}
//  动态数据的action
export function setInfoList(data){
  return (dispatch,getState)=>{
    window.fetch('./api/getInfoList',{
      method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }.then(res=>{
          return res.json;
        }).then(data=>{
          let {code ,data}=data;
          if(code==1000){
            dispatch({type:'SET_INFO_LIST',data:data})
          }
        })
    })
  }
}

/**
 * 最后一步，创建store实例
 * index.js
 * applyMiddleware: redux通过该行数来使用中间件
 * 
 */
import {createStore,applyMiddleware} from 'redux'

// 中间件，作用：如股票不适用该中间件，当我们dispatch一个action的时候，就要给dispatch传入一个对象
//；但如果我们使用了这个中间件，那么就可以传入一个函数，这个函数接收两个参数:dispatch和getState。
// 这个dispatch可以在将来的异步请求完成后使用，对于异步action很有用

import thunk from 'redux-thunk'

// 引入reducer
import reducers from './reducers.js'

// 创建store实例
let store = createStore(
  reducers,
  applyMiddleware(thunk)
)

export default store;




