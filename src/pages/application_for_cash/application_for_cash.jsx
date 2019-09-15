import React,{Component} from 'react'
import './application_for_cash.less'
import {Row,Col,Button,Select,Input,Upload,message,Table} from 'antd'
const {Option}=Select;
const columns = [
    {
      title: '申请日期',
      dataIndex: 'applyTime',
      key: 'applyTime',
    },
    {
      title: '审核日期',
      dataIndex: 'auditTime',
      key: 'auditTime',
    },{
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
      },
    {
      title: '提现类型',
      dataIndex: 'transferType ',
      key: 'transferType ',
    },{
        title: '提现账户',
        dataIndex: 'goodsNum   ',
        key: 'goodsNum   ',
      },{
        title: '状态',
        dataIndex: 'transferStatus',
        key: 'transferStatus',
      }]
class ApplicationForCash extends Component{
    constructor(){
        super();
        this.state={
            dataSource:[]
        }
    }
    render(){
        return (
            <div className="application_for_cash_box">
                {/* 搜索 */}
                <div className="search_box">
                    <p className="title">
                        <span className="searchText">账户余额:</span>
                        <span className="price">￥292929292929</span>
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
                                >
                                    <Option value="0">支付宝</Option>
                                    <Option value="1">微信</Option>
                                </Select>
                            </Col>
                            <Col span={5}>
                                <p className="searchText">账户名称</p>
                                <Input type="text"/>
                            </Col>
                            <Col span={5}>
                                <p className="searchText">提现账户</p>
                                <Input type="text"/>
                            </Col>
                            <Col span={5} className="textRight btnBox">
                                <Button type="primary" style={{marginLeft:30}}>提交申请</Button>
                            </Col>
                        </Row>
                         {/* 顶部搜索结束 */}
                    </div>
                    
                </div>
                 {/* 提现记录 */}
                 <p className="midTitle">提现记录</p>
               <div className="tableBox">
                <Table dataSource={this.state.dataSource} columns={columns} bordered pagination="bottom"/>
               </div>
            </div>
        )
    }
}

export default ApplicationForCash;