import React,{Component} from 'react'
import './order_management.less'
import {Row,Col,Button,Select,Table,message,Input} from 'antd'
const { Column } = Table;
const { Option } = Select;
const columns = [
    {
      title: '订单ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '商品ID',
      dataIndex: 'goodsId ',
      key: 'goodsId ',
    },{
        title: '商品图片',
        dataIndex: 'goodsCover',
        key: 'goodsCover',
      },
    {
      title: '商品名称',
      dataIndex: 'goodsName ',
      key: 'goodsName ',
    },{
        title: '数量',
        dataIndex: 'goodsNum   ',
        key: 'goodsNum   ',
      },{
        title: '状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
      },
      {
        title: '订单金额',
        dataIndex: 'orderAmount  ',
        key: 'orderAmount  ',
      },
      {
        title: '收货地址',
        dataIndex: 'address',
        key: 'address',
      },{
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '物流信息',
        dataIndex: 'logisticsCompany',
        key: 'logisticsCompany',
      },
      {
        title: '下单时间',
        dataIndex: 'submitTime',
        key: 'submitTime'
      },{
        title: '其他',
        dataIndex: 'other',
        key: 'other'
      }
  ];
class OrderManagement extends Component{
    constructor(){
        super()
        this.state={
            dataSource:[],
            pageSize:10,
            pageNum:1
        }
    }
    componentDidMount(){
      this.getOrdersList()
    }
     // 获取列表
     getOrdersList=()=>{
      console.log('执行了')
      window.http('get','business/order/findBusinessGoodsOrders?pageSize='+this.state.pageSize+"&pageNum="+this.state.pageNum).then((res)=>{
          if(res.data.code=='10000'){
              let dataSource=res.data.content.dataList;
              this.setState({dataSource})
          }else{
              message.error(res.data.message);
          }
      })
  }
    render(){
        return (
            <div className="order_management_box">
                <div className="searchBox">
                    <Row type="flex">
                        <Col span={12}>
                            <p className="searchText">订单状态</p>
                            <Select
                                showSearch
                                defaultValue="0"
                                style={{ width: 200 }}
                                optionFilterProp="children"
                            >
                                <Option value="0">全部</Option>
                                <Option value="1">是</Option>
                                <Option value="2">否</Option>
                            </Select>
                        </Col>
                        <Col span={12} className="textRight btnBox">
                            <Button type="primary" style={{marginRight:30}}>下载所有待发货订单</Button>
                            <Button type="primary">批量上传更新</Button>
                        </Col>
                    </Row>
                    <Row type="flex" style={{marginTop:25}}>
                        <Col span={5}>
                            <p className="searchText">收件人性名</p>
                            <Input type="text"/>
                        </Col>
                        <Col span={5}>
                            <p className="searchText">收件人电话</p>
                            <Input type="text"/>
                        </Col>
                        <Col span={5}>
                            <p className="searchText">订单ID</p>
                            <Input type="text"/>
                        </Col>
                        <Col span={5}>
                            <p className="searchText">商品ID</p>
                            <Input type="text"/>
                        </Col>
                        <Col span={4} className="textRight btnBox">
                            <Button type="primary">查询</Button>
                        </Col>
                    </Row>
                </div>
                 {/* 顶部搜索结束 */}
                 <Table dataSource={this.state.dataSource} columns={columns} bordered pagination="bottom"/>;
            </div>
        )
    }
}

export default OrderManagement;
