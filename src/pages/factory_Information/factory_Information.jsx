
import React,{Component} from 'react'
import './factory_Information.less'
import { Button,Row,Col,Input,message,Form } from 'antd';
import {connect} from 'react-redux'
import store from '../../store/index'
import { id } from 'postcss-selector-parser';
import {getFactoryInfo} from '../../store/actions'

class Factory_Information extends Component{
    constructor(){
        super()
        this.state =  {
            factoryName:'',
            contactName:'',
            contactTel:'',
            businessScope:''
        }
    }
    
    componentDidMount(){
       
          // 获取工厂信息
        this.props.getFactoryInfo()
        console.log(this.props.factoryInfo)
        // let {
        //     factoryName,
        //     contactName,
        //     contactTel,
        //     businessScope
        // }= this.props.factoryInfo;
        // this.setState({
        //     factoryName,
        //     contactName,
        //     contactTel,
        //     businessScope
        // })
    }
    componentWillUpdate(){

    }
    componentWillUpdate(){
       
        
    }
    // 提交表单
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                console.log('success')
                console.log(values)
                window.http('post','business/user/updateExtendUser',{
                    "businessScope":values.businessScope,
                    "contactName":values.contactName,
                    "contactTel":values.contactTel,
                    "factoryName":values.factoryName
                 }).then((res)=>{
                     console.log(res)
                     if(res.data.code=='10000'){
                         message.success('保存成功！')
                     }else{
                        message.error(res.data.message);
                     }
                 })
            }else{
                console.log(err)
            }
        })
    }
   
    // 双向数据绑定
    // handleChange(e,name){
    //     console.log('change事件'+e.target.value)
    //     let that=this;
    //     let val=e.target.value;
    //     let obj={};
    //     obj[name]=val;
    //     that.setState(obj)
    // }
    // 判断是否全都填写了
    // isEmpty=(name)=>{
    //     let text;
    //     switch(name){
    //         case 'factoryName':
    //         text="工厂名称"
    //         break;
    //         case 'contactName':
    //         text="联系人"
    //         break;
    //         case 'contactTel':
    //         text='联系电话'
    //         break;
    //         case 'businessScope':
    //         text="经营范围"
    //         break;
    //     }
    //     message.error('请填写'+text)
    // }
    
    render(){
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const {
            factoryName,
            contactName,
            contactTel,
            businessScope
        }=this.props.factoryInfo;
        return (
            <div className="factory_Information_Box">
                <div className="loginContent">
                  <Form layout="vertical" onSubmit={this.handleSubmit} {...formItemLayout}>
                  <Form.Item label=".">
                    <p className="mianTitle">工厂信息{factoryName}</p>
                  </Form.Item>
                    <Form.Item label=" 工厂名称">
                        {
                            getFieldDecorator('factoryName',{
                                initialValue:factoryName,
                                rules: [
                                    {
                                      required: true,
                                      message: '请输入工厂名称',
                                    },
                                  ],
                            })(<Input    className="loginInput" placeholder="" />)
                        }
                        </Form.Item>
                        <Form.Item label=" 联系人">
                        {
                            getFieldDecorator('contactName',{
                                initialValue:contactName,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入联系人'
                                    }
                                ]
                            })(<Input  type="text" className="loginInput" placeholder="" />)
                        }
                        </Form.Item>
                        <Form.Item label=" 联系电话">
                        {
                            getFieldDecorator('contactTel',{
                                initialValue:contactTel,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入联系电话'
                                    }
                                ]
                            })(<Input type="num"  className="loginInput" placeholder="" />
                            )
                        }
                        </Form.Item>
                        <Form.Item label=" 经营范围">
                        {getFieldDecorator('businessScope',{
                             initialValue:businessScope,
                            rules:[
                                {
                                    required:true,
                                    message:'请输入经营范围'
                                }
                            ]
                        })(<Input type="text"  className="loginInput" placeholder="" />
                         )
                        }
                        </Form.Item>
                        <Form.Item label=".">
                              <Button type="primary" htmlType="submit" className="loginBtn" >保存</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return {
        userId:state.userId,
        factoryInfo:state.factoryInfo
    }
}
const mapDispatchToProps=(dispatch)=>{
    return {
        getFactoryInfo(){
            dispatch(getFactoryInfo())
        }
    }
}
const FactoryInformation= Form.create()(Factory_Information)
export default connect(mapStateToProps,mapDispatchToProps)(FactoryInformation);