import React,{Component} from 'react'
import './order_detail.less'
import {Row,Col,Button,Select,Table,message,Input} from 'antd'
const { Column } = Table;
const { Option } = Select;

class OrderDetail extends Component{
    constructor(){
        super()
        this.state={
            orderList:[],
            pageSize:10,
            pageNum:1,
            orderId:'',
            orderStatus:'',
        }
    }
    componentDidMount(){
     this.getOrdersList()
    }
    // 双向数据绑定

    
     // 获取列表
     getOrdersList=()=>{
    console.log(this.state)
      let postObj={
       orderId:1
      };
      window.http('get','business/order/findBusinessOrderDetail',postObj
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
                           
                        </Col>
                        <Col span={12} className="textRight btnBox">
                            
                        </Col>
                    </Row>
        
                </div>
                 {/* 顶部搜索结束 */}
                 <Table dataSource={this.state.orderList}  pagination="bottom" pagination={pagination}  onChange={this.tableChange}>
                    <Column align="center" title="商品信息" dataIndex="orderId" key="orderId"  render={goodsImages => (
                            <div>
                            {goodsImages?
                                goodsImages.map((item,index) => (
                                    <p style={{marginBottom:15}} key={index}><img  className="mainPic" src={this.props.imgUrl+item}/> </p>
                                )):''}
                          </div>
                            
                          )}/>
                    <Column align="center" title="商品及数量" dataIndex="goodsId" key="goodsId" />
                    <Column align="center" title="商品ID" dataIndex="goodsImages" key="goodsImages"  />
                     <Column align="center" title="收件地址" dataIndex="goodsName" key="goodsName" />
                     <Column align="center" title="备注" dataIndex="goodsNum" key="goodsNum" />
                    <Column align="center" title="物流商" dataIndex="orderAmount" key="orderAmount" />
                    <Column align="center" title="物流编号" dataIndex="address" key="address" />
                    <Column align="center" title="订单状态" dataIndex="orderStatusDesc" key="orderStatusDesc" />
                 </Table>
            </div>
        )
    }
}

export default OrderDetail;
