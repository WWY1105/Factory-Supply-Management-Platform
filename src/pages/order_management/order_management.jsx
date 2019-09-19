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
        obj[name]=e.target.value;
        this.setState(obj)
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
                                defaultValue="0"
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                onChange={(e)=>{this.handleChange(e,'orderStatus')}}
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
                 <Table dataSource={this.state.orderList}  bordered pagination="bottom" pagination={pagination}  onChange={this.tableChange}>
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
                     <Column align="center" title="数量" dataIndex="goodsNum" key="goodsNum" />
                     <Column align="center" title="状态" dataIndex="orderStatusDesc" key="orderStatusDesc" />
                    <Column align="center" title="订单金额" dataIndex="orderAmount" key="orderAmount" />
                    <Column align="center" title="收货地址" dataIndex="address" key="address" />
                    <Column align="center" title="备注" dataIndex="remark" key="remark" />
                    <Column align="center" title="物流信息" dataIndex="logisticsCompany" key="logisticsCompany" />
                    <Column align="center" title="下单时间" dataIndex="submitTime" key="submitTime" />
                    <Column align="center" title="备注" dataIndex="order" key="order" 
                        render={orderStatus => (
                            <span>
                              <Button type="primary">详情</Button>
                            </span>
                          )}
                    />
                 </Table>
            </div>
        )
    }
}

export default OrderManagement;
