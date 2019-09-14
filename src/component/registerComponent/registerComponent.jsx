import React,{Component} from 'react'
import './registerComponent.less'
import { Button,Row,Col,Input,message,Form } from 'antd';
import commonObj from '../../assets/js/common'
const FormItem = Form.Item; 
let {checkPhone}={...commonObj}
class RegisterComponent extends Component{
    constructor(props){
        super(props)
        this.state =  {
            bigTitle:'工厂注册',
            mobile:'',
            newPassword:'',
            newPasswordConfirm:'',
            code:"",
            getCodeText:'获取验证码'
        }
    }
    componentDidMount(){
        console.log(this.props)
    }
    
    // 确认登陆
    confirmRegister = e => {
        let that=this;
        let validateFlag=false;
        const { form } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                for(let item in values){
                    if(!values[item]){
                        that.isEmpty(item);
                        validateFlag=false;
                        break;
                    }else{
                        if(item=='mobile'&& checkPhone(values[item])){
                            message.error('请填写正确格式的手机号');
                            break;
                        }
                        validateFlag=true;
                    }
                }

            }
        });
        if(validateFlag){
            if(form.getFieldValue('newPassword')!=form.getFieldValue('newPasswordConfirm')){
                message.error('您输入的密码不一致');
                return false;
            }
            window.post('business/user/register',{
                'mobile':form.getFieldValue('mobile'),
                'code':form.getFieldValue('code'),
                'password':form.getFieldValue('newPassword')
            }).then((res)=>{return res.json()}).then(
                (res)=>{
                   if(res.code=='10000'){
                     this.props.history.push('/index')  
                   }else{
                    message.error(res.message)
                   }
                }
            )
            console.log('POST /business/user/register')
        }
    }
    // 判断是否全都填写了
    isEmpty=(name)=>{
        let text;
        switch(name){
            case 'mobile':
            text="手机号"
            break;
            case 'code':
            text="验证码"
            break;
            case 'newPassword':
            text='密码'
            break;
            case 'newPasswordConfirm':
            text="确认密码"
            break;
        }
        message.error('请填写'+text)
    }
    // 获取验证码
    getCode=()=>{
        let that=this;
        const { form } = this.props;
        let time=60;
        let text='';
        let flag=false;
        let mobile=''
        that.props.form.validateFields((err, values) => {
            // console.log(checkPhone(values.mobile))
            // console.log(!values.mobile)

            if (!err) {
                if(!values.mobile||checkPhone(values.mobile)){
                    message.error('请填写正确格式的手机号');
                    flag= false;
                }else{
                    mobile=values.mobile;
                    flag=true;
                }
            }
        })
        if(!flag){
            return false;
        }
       
        let timer=setInterval(()=>{
            time-=1;
            that.setState({
                'getCodeText':time
            })
            if( time == 0){
                clearInterval(timer)
                that.setState({
                    getCodeText:'获取验证码'
                })
            }
        },1000)
       
        window.get('business/code/sendSmsCode?mobile='+form.getFieldValue('mobile')).then((res)=>{return res.json()}).then(
            (res)=>{
               if(res.code=='10000'){
                   message.success('发送成功')
               }else{
                message.error(res.message)
               }
            }
        )
    }
    render(){
        let {getFieldProps,getFieldDecorator} = this.props.form;
        let bigTitle;// 大标题
        let bottomBtn;// 底部按钮
        if(this.props.forgetPass){
            bigTitle="忘记密码";
            bottomBtn=<Button type="primary" htmlType="submit" className="loginBtn">重置密码</Button>
        }else{
            bigTitle=this.state.bigTitle;
            bottomBtn=<Button type="primary" htmlType="submit" className="loginBtn">确认注册</Button>
        }
        

        return (
            <div className="registerBox">
            <Form onSubmit={this.confirmRegister}>
                <Form.Item>
                    <Row  justify="center" align="top"  type="flex" >
                        <Col span={8} >
                            <Col span={6} order={3} className="leftText">
                            </Col>
                            <Col span={10} order={3}>
                            <p className="mianTitle">{bigTitle}</p>
                            </Col>      
                        </Col>       
                    </Row>
                </Form.Item>
                {/* <div className="loginContent"> */}
                <Form.Item className="loginContent">  
                    <Row justify="center" align="middle" type="flex">
                        <Col span={8} order={4}>
                            <Col span={6} order={3} className="leftText">
                            手机号
                            </Col>
                            <Col span={10} order={3}>
                                <Input  value={this.state.mobile} onChange={(e)=>{this.props.handleChange(e,'username')}}  {...getFieldProps('mobile')} className="loginInput" placeholder="" />
                            </Col>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Row justify="center" align="middle" type="flex">
                        <Col span={8} order={4}>
                            <Col span={6} order={3} className="leftText">
                                短信验证码
                            </Col>
                            <Col span={10} order={3} className="loginInput"> 
                                <Input value={this.state.password} type="text" onChange={(e)=>{this.props.handleChange(e,'mobile')}}  {...getFieldProps('code')} className="loginInput codeInput" placeholder="" />
                                <Button type="primary" className="codeBtn" onClick={()=>{this.getCode()}}>{this.state.getCodeText=='获取验证码'?this.state.getCodeText:this.state.getCodeText+'秒'}</Button>
                            </Col>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Row justify="center" align="middle" type="flex">
                        <Col span={8} order={4}>
                            <Col span={6} order={3} className="leftText">
                                设定密码
                            </Col>
                            <Col span={10} order={3}>
                                <Input  value={this.state.newPassword}  {...getFieldProps('newPassword')} className="loginInput" placeholder="" />
                            </Col>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Row justify="center" align="middle" type="flex">
                        <Col span={8} order={4}>
                            <Col span={6} order={3} className="leftText">
                            再次确认密码
                            </Col>
                            <Col span={10} order={3}>
                                <Input  value={this.state.newPasswordConfirm}  {...getFieldProps('newPasswordConfirm')} className="loginInput" placeholder="" />
                            </Col>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Row justify="center" align="middle" type="flex">
                        <Col span={8} order={4}>
                            <Col span={10} order={3} offset={6}>   
                                {bottomBtn}
                            </Col>
                        </Col>
                    </Row> 
                 </Form.Item>
                {/* </div> */}
                </Form>
            </div>
        )
    }
}

export default Form.create()(RegisterComponent);;