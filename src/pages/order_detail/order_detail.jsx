import React,{Component} from 'react'
import './order_detail.less'
import {Row,Col,Button,Select,Table,message,Input,Modal} from 'antd'
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
            order:{},
            visible:false
        }
    }
    componentDidMount(){
     this.setState({
         orderId:this.props.location.state.orderId
     },()=>{
        this.getOrdersList();
     })
     
    }
    // 双向数据绑定

    
     // 获取列表
     getOrdersList=()=>{
    console.log(this.state)
      let postObj={
       orderId:this.state.orderId
      };
      window.http('get','business/order/findBusinessOrderDetail',postObj
      ).then((res)=>{
          if(res.data.code=='10000'){
              let orderList=[];
                orderList.push(res.data.content)
              this.setState({orderList,order:res.data.content})
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
// 修改物流
modify_Logistics(index){
        console.log(index);
        console.log(this)
        // 物流编号
        console.log(this['logisticsNumber_input_'+index].state.value)
        if(!this['logisticsNumber_input_'+index].state.value){
            message.error('请填写物流编号')
        }else if(!this['logisticsCompany_input_'+index].state.value){
            //物流商
            message.error('请填写物流商')
        }else{
            let postObj={
                "goodsOrderId":this.state.orderId,
                "logisticsCompany": this['logisticsCompany_input_'+index].state.value,
                "logisticsNumber": this['logisticsNumber_input_'+index].state.value
             }
            window.http('post','business/order/updateLogistics',postObj
            ).then((res)=>{
                if(res.data.code=='10000'){
                    message.success(res.data.message);
                }else{
                    message.error(res.data.message);
                }
            })
        }
    }
    // 发货
    toDeliverGoods(){
        let postObj={
            "goodsOrderId":this.state.orderId
         }
        window.http('post','business/order/delivery',postObj
        ).then((res)=>{
            if(res.data.code=='10000'){
                message.success(res.data.message);
            }else{
                message.error(res.data.message);
            }
        })
    }
    // 退款状态、
    toDrawback(index,status){
        let postObj={
            "auditStatus": status,
            "goodsOrderId": this.state.orderId
          }
          window.http('post','business/order/auditRefund',postObj
          ).then((res)=>{
              if(res.data.code=='10000'){
                  message.success(res.data.message);
              }else{
                  message.error(res.data.message);
              }
          })
    }
    render(){
        let pagination={
            defaultCurrent:1,
            total:this.state.total,
            pageSize:this.state.pageSize,
           
        }
        return (
            <div className="order_detail_box">
                <div className="searchBox">
                {/* 弹窗 */}
                <Modal
                title="Basic Modal"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                <p>确认操作？</p>
                </Modal>
                {/* 弹窗 */}
                    <Row type="flex">
                        <Col span={12}>
                           <span className="orderId">订单ID：TBASD12312341241</span>
                           <span className="money">订单金额
                           <span className="num">￥1230.00（运费￥10.00）</span>
                           </span>
                        </Col>
                        <Col span={12} className="textRight">
                            <p className="time">下单时间:{this.state.order.submitTime}</p>
                        </Col>
                    </Row>
                </div>
                 {/* 顶部搜索结束 */}
                 <Table dataSource={this.state.orderList}  pagination="bottom" pagination={pagination}  onChange={this.tableChange}>
                    <Column align="center" title="商品信息"  key="goodsImages"  
                    // render={goodsImages => (
                    //         <div>
                    //         {goodsImages?
                    //             goodsImages.map((item,index) => (
                    //                 <p style={{marginBottom:15}} key={index}><img  className="mainPic" src={this.props.imgUrl+item}/> </p>
                    //             )):''}
                    //       </div>
                            
                    //       )}
                          />
                    <Column align="center" title="商品及数量" dataIndex="goodsName" key="goodsName" render={
                       (text, record, index)=>(
                            <div>
                                <p></p>
                                <p>{record.goodsNum}</p>
                            </div>
                        )
                    }/>
                    <Column align="center" title="商品ID" dataIndex="goodsId" key="goodsId"  />
                     <Column align="center" title="收件地址" dataIndex="address" key="address" render={
                       (text, record, index)=>(
                            <div>
                                <p>{record.receiverName},{record.receiverPhone}</p>
                                <p>{record.provinceName}{record.cityName}{record.areaName}</p>
                                <p>{record.address}</p>
                            </div>
                        )
                    }/>
                     <Column align="center" title="备注" dataIndex="remark" key="remark" render={
                        (remark)=>(
                            <span className="text-danger redText">{remark}</span>
                        )
                    }/>
                    <Column align="center" title="物流商" dataIndex="logisticsCompany" key="logisticsCompany" render={
                        (text, record, index)=>(
                            <Input defaultValue={text} ref={node => (this['logisticsCompany_input_'+index] = node)} />
                        )
                    }/>
                    <Column align="center" title="物流编号" dataIndex="logisticsNumber" key="logisticsNumber" render={
                        (text, record, index)=>(
                            <Input defaultValue={text} ref={node => (this['logisticsNumber_input_'+index] = node)} />
                            
                        )
                    }/>
                    <Column align="center" title="订单状态" dataIndex="orderStatus" key="orderStatus" render={
                        // orderStatus (integer, optional): 订单状态
                        //(0:待支付,1:已支付，待发货,3:已发货，待评价,5:申请退款中,6:退款完成,7:订单超时关闭,
                        //8:申请退款退货中,9:退款退货完成,10:退款驳回,11:退款退货驳回,13:已评价，已完成,14:申请保修)
                        (orderStatus, record, index)=>(
                            <div>
                               {
                                    orderStatus=='1'?(<div><p className="redText">待发货</p><Button type="primary" onClick={()=>{this.toDeliverGoods(index)}}>发货</Button></div>):
                                    orderStatus=='5'?(<div><p className="redText">仅退款</p><div><Button type="primary" style={{marginRight:10}} onClick={()=>{this.toDrawback(index,1)}}>同意</Button><Button onClick={()=>{this.toDrawback(index,2)}} type="danger">拒绝</Button></div></div>):
                                    orderStatus=='3'?(<div><p className="blueText">已发货</p><Button type="primary" onClick={()=>{this.modify_Logistics(index)}}>修改物流</Button></div>):
                                    orderStatus=='8'?(<div><p className="redText">退货退款</p><div><Button type="primary" style={{marginRight:10}} onClick={()=>{this.toDrawback(index)}}>同意</Button><Button type="danger">拒绝</Button></div></div>):
                                    orderStatus=='0'?(<div><p className="redText">待支付</p></div>):
                                    orderStatus=='6'?(<div><p className="redText">退款完成</p></div>):
                                    orderStatus=='7'?(<div><p className="redText">订单超时关闭</p></div>):
                                    orderStatus=='9'?(<div><p className="redText">退款退货完成</p></div>):
                                    orderStatus=='10'?(<div><p className="redText">退款驳回</p></div>):
                                    orderStatus=='11'?(<div><p className="redText">退款退货驳回</p></div>):
                                    orderStatus=='13'?(<div><p className="redText">已完成</p></div>):
                                    orderStatus=='14'?(<div><p className="redText">申请保修</p></div>):""
                               }
                           
                            </div>
                        )
                        }/>
                 </Table>
            </div>
        )
    }
}

export default OrderDetail;
