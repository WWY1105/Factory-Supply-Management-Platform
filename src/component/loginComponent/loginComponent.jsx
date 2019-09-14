import React,{Component} from 'react'
import './loginComponent.less'
import { Button,Row,Col,Input, message} from 'antd';
import { Link,withRouter  } from 'react-router-dom'
import {connect} from 'react-redux'
import {setUserId} from '../../store/actions'
class LoginComponent extends Component{
    constructor(){
        super()
        this.state =  {
            username:'',
            password:'',
            bigTitle:'登陆'
        }
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
    // 点击登陆
    toLogin(){
        //  console.log(window)
        if(!this.state.username){
            message.error('请填写用户名');
            return false;
        }else{
            if(!this.state.password){
                message.error('请填写密码');
                return false;
            }
        }
         window.post('business/user/password/login',{
            'userName':this.state.username,
            'password':this.state.password
        }).then((res)=>{return res.json()}).then(
            (res)=>{
                if(res.code=='10000'){
                     console.log(this.props)
                     let result={...res.content};
                     this.props.setUserId(res.content.user.id)
                     localStorage.setItem('userId',res.content.user.id)
                     localStorage.setItem('loginToken',result.token.access_token);
                     this.props.history.push('/index/factory_Information')
                }else{
                   message.error(res.message);
                }
            }
        )
    }
    render(){
        return (
            <div className="loginBox">
                <Row  justify="center" align="top"  type="flex" >
                    <Col span={6} >
                    <Col span={6} order={3} className="leftText">
                        </Col>
                        <Col span={10} order={3}>
                        <p className="mianTitle">{this.state.bigTitle}</p>
                        </Col>      
                    </Col>       
                </Row>
                <div className="loginContent">
                    <Row justify="center" align="middle" type="flex">
                        <Col span={6} order={4}>
                            <Col span={6} order={3} className="leftText">
                            账号
                            </Col>
                            <Col span={10} order={3}>
                                <Input  value={this.state.username} onChange={(e)=>{this.handleChange(e,'username')}} className="loginInput" placeholder="" />
                            </Col>
                        </Col>
                    </Row>
                    <Row justify="center" align="middle" type="flex">
                        <Col span={6} order={4}>
                            <Col span={6} order={3} className="leftText">
                                密码
                            </Col>
                            <Col span={10} order={3}>
                                <Input value={this.state.password} type="password" onChange={(e)=>{this.handleChange(e,'password')}} className="loginInput" placeholder="" />
                            </Col>
                        </Col>
                    </Row>
                    <Row justify="center" align="middle" type="flex">
                        <Col span={6} order={4}>
                            <Col span={10} order={3} offset={6}>   
                                <Button type="primary" className="loginBtn" onClick={()=>{this.toLogin()}}>登陆</Button>
                                <Button type="primary" className="loginBtn transLoginBtn" onClick={()=>{this.props.toRegister()}}>工厂注册</Button>
                            </Col>
                        </Col>
                    </Row>
                    <Row justify="center" align="middle" type="flex">
                        <Col span={6} order={4}>
                            <Col span={10} order={3}  offset={6}>
                                <p className="forgetPass" onClick={()=>{this.props.toRegister()}}> 忘记密码</p>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return {
        userObj:state.userObj
    }
}
const mapDispatchToProps=(dispatch,ownProps)=>{
    return {
        setUserId(data){
            dispatch(setUserId(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginComponent));