import React,{Component} from 'react'
import './application_for_cash.less'
import {connect} from 'react-redux'
import {Row,Col,Button,Select,Input,Upload,message,Table,Pagination} from 'antd'
const {Option}=Select;
const { Column } = Table;

class ApplicationForCash extends Component{
    constructor(){
        super();
        this.state={
            dataSource:[],
            alipayAccount: '',
            amount: 0,
            realName: '',
            userId: 0,
            pageSize:10,
            pageNum:0,
            total:0
        }
    }
    componentDidMount(){
        this.getFactoryIbfo();
        this.getRecordList()
    }
     // 获取列表
     getRecordList=()=>{
        window.http('get','business/user/findUserTransferApplys?pageSize='+this.state.pageSize+"&pageNum="+this.state.pageNum).then((res)=>{
            if(res.data.code=='10000'){
                let dataSource=res.data.content.dataList;
                this.setState({dataSource,total:res.data.content.page.total})
            }else{
                message.error(res.data.message);
            }
        })
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
    // 获取工厂信息
    getFactoryIbfo=()=>{
        if(this.props.userId){
            window.http('get','business/user/findBusinessUser?userId='+this.props.userId).then((res)=>{
                if(res.data.code=='10000'){
                    this.setState({balance:res.data.content.balance})
                }else{
                    message.error(res.data.message);
                }
            })
        }
    }
    // 提交提现记录
    submitApply=()=>{
        let post_data={
            alipayAccount: this.state.alipayAccount,//支付宝账户 ,
            amount : this.state.amount,// 提现金额 ,
            realName: this.state.realName//真实姓名 ,
        }
        console.log(post_data);
        window.http('post','business/user/alipayTransferApply',post_data).then((res)=>{
            if(res.data.code=='10000'){
                message.success('提交成功');
                this.getRecordList()
            }else{
                message.error(res.data.message);
            }
        })
    }
    // 分页改变
    tableChange=(pagination)=>{
        // console.log(pagination.current)
        let pageNum=pagination.current;
        this.setState({pageNum},()=>{
            this.getRecordList()
        });
        
    }
    render(){
        let pagination={
            defaultCurrent:1,
            total:this.state.total,
            pageSize:this.state.pageSize,
           
        }
        return (
            <div className="application_for_cash_box">
                {/* 搜索 */}
                <div className="search_box">
                    <p className="title">
                        <span className="searchText">账户余额:</span>
                        <span className="price">￥{this.state.balance}</span>
                    </p>
                    <div className="search">
                        <Row type="flex" gutter={30}>
                            <Col span={5}>
                                <p className="searchText">提现类型</p>
                                <Select
                                    showSearch
                                    defaultValue="0"
                                    style={{ width: 200 }}
                                    optionFilterProp="children"
                                    onChange={(e)=>{this.handleChange(e,'factoryName')}}
                                >
                                    <Option value="0">支付宝</Option>
                                    <Option value="1">微信</Option>
                                </Select>
                            </Col>
                            <Col span={5}>
                                <p className="searchText">账户名称</p>
                                <Input type="text"  onChange={(e)=>{this.handleChange(e,'realName')}}/>
                            </Col>
                            <Col span={5}>
                                <p className="searchText">提现账户</p>
                                <Input type="text"  onChange={(e)=>{this.handleChange(e,'alipayAccount')}}/>
                            </Col>
                            <Col span={5} className="textRight btnBox">
                                <Button type="primary" style={{marginLeft:30}} onClick={()=>{this.submitApply()}}>提交申请</Button>
                            </Col>
                        </Row>
                         {/* 顶部搜索结束 */}
                    </div>
                    
                </div>
                 {/* 提现记录 */}
                 <p className="midTitle">提现记录</p>
               <div className="tableBox">
                <Table dataSource={this.state.dataSource} bordered pagination={pagination}  onChange={this.tableChange}>
                    <Column align="center" title="申请日期" dataIndex="createTime" key="createTime" />
                    <Column align="center" title="审核日期" dataIndex="auditTime" key="auditTime" />
                    <Column align="center" title="金额" dataIndex="amount" key="amount" />
                    <Column align="center" title="提现类型" dataIndex="transferType" key="transferType" />
                    <Column align="center" title="提现账户" dataIndex="goodsNum" key="goodsNum" />
                    <Column align="center" title="状态" dataIndex="transferStatus" key="transferStatus" render={
                        (transferStatus)=>{
                            // 提现状态(0:待审核,1:审核通过,2:审核驳回) ,
                            return (
                                <span>{transferStatus=='0'?'待审核':transferStatus=='1'?'审核通过':'审核驳回'}</span>
                            )
                        }
                    }/>
                </Table>
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
export default connect(mapStateToProps)(ApplicationForCash);