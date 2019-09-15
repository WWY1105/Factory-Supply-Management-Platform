import React,{Component} from 'react'
import './commodity_management.less'
import {Row,Col,Button,Select,Table,message,Icon} from 'antd'
import {connect} from 'react-redux'
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const  columns=[
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '主图',
      dataIndex: 'goodsCover',
      key: 'goodsCover',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    },{
        title: '单价',
        dataIndex: 'goodsInventorys',
        key: 'goodsInventorys'
      },{
        title: '库存',
        dataIndex: 'inventoryNum',
        key: 'inventoryNum',
      },{
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '运费',
        dataIndex: 'logisticsFee',
        key: 'logisticsFee',
      },
      {
        title: '发货时间',
        dataIndex: 'address',
        key: 'address',
      },{
        title: '大分类',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '小分类',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '上下架',
        dataIndex: 'goodsStatus',
        key: 'goodsStatus',
      },{
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '删除',
        dataIndex: 'delete',
        key: 'delete',
      },
      {
        title: '其他',
        dataIndex: 'other',
        key: 'other',
      }
  ];
class CommodityManagement extends Component{
    constructor(){
        super()
        this.state={
            dataSource:[],//表格数据来源
            pageNum:1,
            pageSize:10
        }
    }
    // 点击新增
    gotoEdit=(id)=>{
        // 跳转编辑页面
        let filterArr;
        let filterObj;
        // console.log(id)
        // return false;
        if(id){
            let filterArr=this.state.dataSource.filter((i,j)=>{
                if(i.id==id){
                    return true;
                }
            })
            if(filterArr.length>0){
                filterObj=filterArr[0]
            }
            console.log(filterObj)
            this.props.history.push({
                pathname:'goods_edit',
                state:{
                    filterGood:filterObj
                }
            })

        }else{
            this.props.history.push({
                pathname:'goods_edit',
            })
        }
        
    }
    // 获取列表
    getGoodsList=()=>{
        console.log('执行了')
        window.http('get','business/goods/findGoodses?pageSize='+this.state.pageSize+"&pageNum="+this.state.pageNum).then((res)=>{
            if(res.data.code=='10000'){
                let dataSource=res.data.content.dataList;
                this.setState({dataSource})
            }else{
                message.error(res.data.message);
            }
        })
    }
    componentDidMount(){
        this.getGoodsList()
    }
    render(){
        return (
            <div className="commodity_management_box">
                {/* 商品管理 */}
                <div className="searchBox">
                    <Row>
                        <Col span={12}>
                            <Col span={10}>
                                <p className="searchText">是否上架</p>
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
                            <Col span={10}>
                                <p className="searchText">是否有库存</p>
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
                        </Col>
                        <Col span={12} className="textRight btnBox">
                            <Button type="primary">查询</Button>
                            <Button type="primary" className="addBtn" onClick={this.gotoEdit.bind(this)}>新增+</Button>
                        </Col>
                    </Row>
                </div> 
                {/* 顶部搜索结束 */}
                <Table dataSource={this.state.dataSource}  bordered pagination="bottom" size="small" rowKey={record=>record.id}>
                    <Column align="center" title="ID" dataIndex="id" key="id" />
                    <Column align="center" title="主图" dataIndex="goodsImages" key="goodsImages" 
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
                    <Column align="center" title="商品单价" dataIndex="goodsInventorys1" key="goodsInventorys1" 
                        render={goodsInventorys => (
                            <span>
                              {goodsInventorys?
                              goodsInventorys.map((item,index) => (
                                <p key={index} className="tableNum textCenter">￥{item.supplyPrice}</p>
                              )):''}
                            </span>
                          )}
                    />
                     <Column align="center" title="库存" dataIndex="goodsInventorys2" key="goodsInventorys2" 
                        render={goodsInventorys => (
                            <span>
                              {goodsInventorys?
                              goodsInventorys.map((item,index) => (
                                <p key={index} className="tableCommonText">{item.inventoryNum}</p>
                              )):''}
                            </span>
                          )}
                    />
                     
                     <Column align="center" title="单位" dataIndex="unit" key="unit" />
                     <Column align="center" title="运费" dataIndex="logisticsFee" key="logisticsFee" />
                     <Column align="center" title="发货时间" dataIndex="deliveryDays" key="deliveryDays"
                        render={deliveryDays => (
                            <span>
                             {deliveryDays}天内
                            </span>
                          )}
                     />
                     <Column align="center" title="大分类" dataIndex="goodsCategorys1" key="goodsCategorys1" 
                        render={goodsCategorys => (
                            <span>
                              {goodsCategorys?
                              goodsCategorys.map((item,index) => (
                                <p key={index}>{item.level=='1'?item.categoryName:''}</p>
                              )):''}
                            </span>
                          )}
                    />
                     <Column align="center" title="小分类" dataIndex="goodsCategorys2" key="goodsCategorys2" 
                        render={goodsCategorys => (
                            <span>
                              {goodsCategorys?
                              goodsCategorys.map((item,index) => (
                                <p key={index}>{item.level=='2'?item.categoryName:''}</p>
                              )):''}
                            </span>
                          )}
                    />
                    <Column align="center" title="上下架" dataIndex="goodsStatus" key="goodsStatus" 
                        render={goodsStatus => (
                            <span>
                              {goodsStatus=='1'?'上架':goodsStatus=='0'?'上架中':'下架'}
                            </span>
                          )}
                    />
                    <Column align="center" title="排序" dataIndex="id" key="sort" 
                        render={(id) => (
                            <span>
                              <Icon type="up-square" />
                              <Icon type="down-square" />
                            </span>
                          )}
                    />
                    <Column align="center" title="删除" dataIndex="id" key="delete" 
                       render={id => (
                        <span className="tableDelete">
                          删除
                        </span>
                      )}
                    />
                    <Column align="center" title="其他" dataIndex="id" key="other" 
                        render={id => (
                            <span  className="tableEdit" onClick={()=>{this.gotoEdit(id)}} id={id}>
                              编辑
                            </span>
                          )}
                    />
                </Table>
                
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        imgUrl:state.imgUrl
    }
}
export default connect(mapStateToProps)(CommodityManagement);