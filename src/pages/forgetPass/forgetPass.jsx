import React,  {Component}from 'react'

// import commonObj from '../../assets/js/common'
import './login.less'
import TopBar from '../../component/topBar/topBar'
import LoginComponent from '../../component/loginComponent/loginComponent'
import RegisterComponent from '../../component/registerComponent/registerComponent'
// import PropTypes from 'prop-types'; 
import {connect }from 'react-redux'
// import {message } from 'antd';
// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响

//  import {setGradeList, setPageTitle,getBanner} from '../../store/actions'
class ForgetPass extends Component {
    constructor(props) {
        super(props)
        this.state={
            toregister:false,
            forgetPass:false
        }
        this.handleChange=this.handleChange.bind(this)
        
    }
    // 双向数据绑定
    handleChange(e,name){
        console.log('change事件'+e.target.value)
        let that=this;
        let val=e.target.value;
        let obj={};
        obj[name]=val;
        that.setState(obj)
    }
    
    // 点击工厂注册/忘记密码
    toRegister(){
        this.setState({
            toregister:true,
            forgetPass:true
        })
    }
    componentDidMount() {
    
    
    }

    componentWillMount() {
        
    }


    render() {
      
       
        return ( 
            < div className="login bgImg">
                {/* 顶部栏 */}
               <TopBar></TopBar>
                {/*注册*/}
                <RegisterComponent  forgetPass="true"></RegisterComponent>
            </div > 
            )
    }
}
//mapStateToProp :将state映射到组件的props中
const mapStateToProps = (state) =>  {
    // state 打印出来是reducer
    // console.log(state)
    return { bannerList:state.bannerList,
      
    }
  }
  // mapDispatchToProps：将action映射到组件的props中
const mapDispatchToProps = (dispatch, ownProps) =>  {
    return {
    }
  }


//   ------------------------------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPass); 
