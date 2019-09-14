

import {get} from '../assets/js/fetch'
// 点击左边菜单改变
function setLeftNav(data){
    return (dispatch)=>{
        dispatch({type:'SET_LEFT_NAV',data})
    }
}

//  设置每页title
 function setPageTitle (data) {
    return (dispatch, getState) => {
      dispatch({ type: 'SET_PAGE_TITLE', data: data })
    }
  }
// 设置当前登陆用户
function setUserId(data){
  console.log('用户')
  console.log(data)
  return (dispatch)=>{
    dispatch({type:'SET_USER_OBJ',data})
  }
}

  export{
    setLeftNav,
    setPageTitle,
    setUserId
  }