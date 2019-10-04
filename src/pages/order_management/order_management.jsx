import React,{Component} from 'react'
import './order_management.less'
import {Row,Col,Button,Select,Table,message,Input} from 'antd'
const { Column } = Table;
const { Option } = Select;

class OrderManagement extends Component{
    constructor(){
        super()
        this.state={
            orderList:[],
            pageSize:10,
            pageNum:1,
            receiverPhone:'',
            receiverName:'',
            goodsId:'',
            orderId:'',
            orderStatus:'',
            total:0
        }
    }
    componentDidMount(){
      this.getOrdersList()
    }
    // 双向数据绑定
    handleChange=(e,name)=>{
        let obj={};
        if(e.target){
            obj[name]=e.target.value;
            this.setState(obj)
        }
        console.log(e.target.value)
       
    }
    
     // 获取列表
     getOrdersList=()=>{
    console.log(this.state)
      let postObj={
        pageNum:this.state.pageNum,
        pageSize:this.state.pageSize
      };
      if(this.state.goodsId){
        postObj.goodsId=this.state.goodsId;
      }
      if(this.state.receiverPhone){
        postObj.receiverPhone=this.state.receiverPhone;
      }
      if(this.state.receiverName){
        postObj.receiverName=this.state.receiverName;
      }
      if(this.state.orderId){
        postObj.orderId=this.state.orderId;
      }
      if(this.state.orderStatus){
        postObj.orderStatus=this.state.orderStatus;
      }

      window.http('get','business/order/findBusinessGoodsOrders',postObj
      ).then((res)=>{
          if(res.data.code=='10000'){
              let orderList=res.data.content.dataList;
              this.setState({orderList,total:res.data.content.page.total})
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
            this.getOrdersList()
        });
        
    }
    toOrderDetail=(orderId)=>{
        console.log(orderId)
        this.props.history.push({
            pathname:'/index/order_detail',
            state:{
                orderId:orderId
            }
        })
    }
    orderStatusChange=(selectedItems)=>{
        this.setState({orderStatus:selectedItems})
    }
    render(){
        let pagination={
            defaultCurrent:1,
            total:this.state.total,
            pageSize:this.state.pageSize,
           
        }
        return (
            <div className="order_management_box">
                <div className="searchBox">
                    <Row type="flex">
                        <Col span={12}>
                            <p className="searchText">订单状态</p>
                            <Select
                                showSearch
                                defaultValue=""
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                onChange={this.orderStatusChange}
                            >
                                     <Option value="">全部</Option>
                                     <Option value='1'>待发货</Option>
                                     <Option value='5'>仅退款</Option>
                                     <Option value='3'>已发货</Option>
                                     <Option value='8'>退货退款</Option>
                                     <Option value='0'>待支付</Option>
                                     <Option value='6'>退款完成</Option>
                                     <Option value='7'>订单超时关闭</Option>
                                     <Option value='9'>退款退货完成</Option>
                                     <Option value='10'>退款驳回</Option>
                                     <Option value='11'>退款退货驳回</Option>
                                     <Option value='13'>已完成</Option>
                                     <Option value='14'>申请保修</Option>
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
                            <Input type="text"  onChange={(e)=>{this.handleChange(e,'receiverPhone')}}/>
                        </Col>
                        <Col span={5}>
                            <p className="searchText">收件人电话</p>
                            <Input type="text"  onChange={(e)=>{this.handleChange(e,'receiverName')}}/>
                        </Col>
                        <Col span={5}>
                            <p className="searchText">订单ID</p>
                            <Input type="text"  onChange={(e)=>{this.handleChange(e,'orderId')}}/>
                        </Col>
                        <Col span={5}>
                            <p className="searchText">商品ID</p>
                            <Input type="text"  onChange={(e)=>{this.handleChange(e,'goodsId')}}/>
                        </Col>
                        <Col span={4} className="textRight btnBox">
                            <Button type="primary" onClick={()=>{this.getOrdersList()}}>查询</Button>
                        </Col>
                    </Row>
                </div>
                 {/* 顶部搜索结束 */}
                 <Table dataSource={this.state.orderList}  bordered pagination="bottom" pagination={pagination}  onChange={this.tableChange}
                >
                    <Column align="center" title="订单ID" dataIndex="orderId" key="orderId" />
                    <Column align="center" title="商品ID" dataIndex="goodsId" key="goodsId" />
                    <Column align="center" title="商品主图" dataIndex="goodsImages" key="goodsImages" 
                        render={goodsImages => (
                            <div>
                            {goodsImages?
                                goodsImages.map((item,index) => (
                                    <p style={{marginBottom:15}} key={index}><img  className="mainPic" src={this.props.imgUrl+item}/> </p>
                                )):''}
                          </div>
                            
                          )}
                    />
                     <Column align="center" title="商品名称" dataIndex="goodsName" key="goodsName" />
                     <Column align="center" title="数量" dataIndex="goodsNum" key="goodsNum"  render={
                         (goodsNum)=>(
                            <p className="blueText"><span>{goodsNum}</span>件</p>
                         )
                     }/>
                     <Column align="center" title="状态" dataIndex="orderStatus" key="orderStatus" render={
                          orderStatus=>(
                            <div>
                               {
                                    orderStatus=='1'?(<div><p className="redText">待发货</p></div>):
                                    orderStatus=='5'?(<div><p className="redText">仅退款</p></div>):
                                    orderStatus=='3'?(<div><p>已发货</p></div>):
                                    orderStatus=='8'?(<div><p className="redText">退货退款</p></div>):
                                    orderStatus=='0'?(<div><p>待支付</p></div>):
                                    orderStatus=='6'?(<div><p>退款完成</p></div>):
                                    orderStatus=='7'?(<div><p>订单超时关闭</p></div>):
                                    orderStatus=='9'?(<div><p>退款退货完成</p></div>):
                                    orderStatus=='10'?(<div><p>退款驳回</p></div>):
                                    orderStatus=='11'?(<div><p>退款退货驳回</p></div>):
                                    orderStatus=='13'?(<div><p>已完成</p></div>):
                                    orderStatus=='14'?(<div><p className="redText">申请保修</p></div>):""
                               }
                           
                            </div>
                        )
                     }/>
                    <Column align="center" title="订单金额" dataIndex="orderAmount" key="orderAmount" />
                    <Column align="center" title="收货地址" dataIndex="address" key="address" render={
                       (text, record, index)=>(
                            <div>
                                <p>{record.receiverName},{record.receiverPhone}</p>
                                <p>{record.provinceName},{record.cityName},{record.areaName}</p>
                                <p>{record.address}</p>
                            </div>
                        )
                    }/>
                    <Column align="center" title="备注" dataIndex="remark" key="remark" render={
                        (remark)=>(
                            <span className="text-danger redText">{remark}</span>
                        )
                    }/>
                    <Column align="center" title="物流信息" dataIndex="logisticsCompany" key="logisticsCompany" />
                    <Column align="center" title="下单时间" dataIndex="submitTime" key="submitTime" />
                    <Column align="center" title="其他" dataIndex="orderId" key="order" 
                        render={orderId => (
                            <span>
                              <Button type="primary" onClick={()=>{this.toOrderDetail(orderId)}}>详情</Button>
                            </span>
                          )}
                    />
                 </Table>
            </div>
        )
    }
}

export default OrderManagement;
