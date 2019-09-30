

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
// 获取工厂信息+this.props.userId
function getFactoryInfo(){
  return (dispatch)=>{

    window.http('get','business/user/findBusinessUser?userId=13').then((res)=>{
      if(res.data.code=='10000'){
         dispatch({type:'GET_FACTORY_INFO',data:res.data.content})
          //  console.log(res.data.content)
      }else{
          // message.error(res.data.message);
      }
  })
  }
}

  export{
    setLeftNav,
    setPageTitle,
    setUserId,
    getFactoryInfo
  }