
import React,{Component} from 'react'
import './factory_Information.less'
import { Button,Row,Col,Input,message } from 'antd';
import {connect} from 'react-redux'
import { id } from 'postcss-selector-parser';
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
        console.log(this.props)
        this.getFactoryIbfo()
    }
    // 获取工厂信息
    getFactoryIbfo=()=>{
        if(this.props.userId){
            window.http('get','business/user/findBusinessUser?userId='+this.props.userId).then((res)=>{
                if(res.data.code=='10000'){

                }else{
                    message.error(res.data.message);
                }
            })
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
    // 判断是否全都填写了
    isEmpty=(name)=>{
        let text;
        switch(name){
            case 'factoryName':
            text="工厂名称"
            break;
            case 'contactName':
            text="联系人"
            break;
            case 'contactTel':
            text='联系电话'
            break;
            case 'businessScope':
            text="经营范围"
            break;
        }
        message.error('请填写'+text)
    }
    // 保存工厂信息
    toSave=()=>{
        let flag=false;
        for(var i in this.state){
            if(!this.state[i]){
                this.isEmpty(i);
                flag=false;
                break;
            }else{
                flag=true;
            }
        }
        console.log(flag)
        console.log(this.state)
        if(flag){
             window.http('post','business/user/updateExtendUser',{
                "businessScope":this.state.businessScope,
                "contactName":this.state.contactName,
                "contactTel":this.state.contactTel,
                "factoryName":this.state.factoryName
             }).then((res)=>{
                 console.log(res)
                 if(res.data.code=='10000'){
                     message.success('保存成功！')
                 }else{
                    message.error(res.data.message);
                 }
             })
        }
        
    }
    render(){
        return (
            <div className="factory_Information_Box">
                <Row  justify="center" align="top"  type="flex" >
                    <Col span={24} >
                         <p className="mianTitle">工厂信息</p>    
                    </Col>       
                </Row>
                <div className="loginContent">
                    <Row justify="center" align="middle" type="flex">
                            <Col span={10} order={3} className="leftText">
                                工厂名称
                            </Col>
                            <Col span={14} order={3}>
                                <Input  value={this.state.factoryName} onChange={(e)=>{this.handleChange(e,'factoryName')}} className="loginInput" placeholder="" />
                            </Col>
                    </Row>
                    <Row justify="center" align="middle" type="flex">
                            <Col span={10} order={3} className="leftText">
                                联系人
                            </Col>
                            <Col span={14} order={3}>
                                <Input value={this.state.contactName} type="text" onChange={(e)=>{this.handleChange(e,'contactName')}} className="loginInput" placeholder="" />
                            </Col>
                    </Row>
                    <Row justify="center" align="middle" type="flex">
                            <Col span={10} order={3} className="leftText">
                                联系电话
                            </Col>
                            <Col span={14} order={3}>
                                <Input value={this.state.contactTel} type="num" onChange={(e)=>{this.handleChange(e,'contactTel')}} className="loginInput" placeholder="" />
                            </Col>
                    </Row>
                    <Row justify="center" align="middle" type="flex">
                            <Col span={10} order={3} className="leftText">
                                经营范围
                            </Col>
                            <Col span={14} order={3}>
                                <Input value={this.state.businessScope} type="text" onChange={(e)=>{this.handleChange(e,'businessScope')}} className="loginInput" placeholder="" />
                            </Col>
                    </Row>
                    <Row justify="center" align="middle" type="flex">
                     
                            <Col span={14} order={3} offset={10}>   
                                <Button type="primary" className="loginBtn" onClick={()=>{this.toSave()}}>保存</Button>
                            </Col>
                        
                    </Row>
                   
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return {
        userId:state.userId
    }
}
export default connect(mapStateToProps)(Factory_Information);