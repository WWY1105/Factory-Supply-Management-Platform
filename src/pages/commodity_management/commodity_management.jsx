import React,{Component} from 'react'
import './commodity_management.less'
import {Row,Col,Button,Select,Table,message,Icon,Modal} from 'antd'
import {connect} from 'react-redux'
const { Option } = Select;
const { Column } = Table;
class CommodityManagement extends Component{
    constructor(){
        super()
        this.state={
            dataSource:[],//表格数据来源
            pageNum:1,
            pageSize:10,
            visible:false,
            deleteId:'',
            goodsStatus:'',
            hasInventory:'',
            total:0//分页数据总数
        }
    }
    hideModal=()=>{
        this.setState({visible:false})
    }
    showModel=(id)=>{
        this.setState({visible:true,deleteId:id})
    }
    // 点击新增
    gotoEdit=(id)=>{
        // 跳转编辑页面
        let filterArr;
        let filterObj;
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
    // 删除商品
    gotoDelete=()=>{
        let ids=new Array();
        ids.push(this.state.deleteId)
        window.http('delete','business/goods/removeGoods',{ids:ids}).then((res)=>{
            if(res.data.code=='10000'){
                message.success('删除成功');
                this.hideModal();
                this.getGoodsList()
            }else{
                message.error(res.data.message);
            }
        })
    }
    // 获取列表
    getGoodsList=()=>{
        window.http('get','business/goods/findGoodses?pageSize='+this.state.pageSize+"&pageNum="+this.state.pageNum+"&goodsStatus="+this.state.goodsStatus+"&hasInventory="+this.state.hasInventory).then((res)=>{
            if(res.data.code=='10000'){
                let dataSource=res.data.content.dataList;
                this.setState({dataSource,total:res.data.content.page.total})
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
            this.getGoodsList()
        });
        
    }
    // 搜索select改变
    goodsStatusChange=(selectedItems)=>{
        this.setState({goodsStatus:selectedItems})
    }
    hasInventoryChange=(selectedItems)=>{
        this.setState({hasInventory:selectedItems})
    }
    componentDidMount(){
        this.getGoodsList()
    }
    render(){
        let pagination={
            defaultCurrent:1,
            total:this.state.total,
            pageSize:this.state.pageSize,
           
        }
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
                                value={this.state.goodsStatus}
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                onChange={this.goodsStatusChange}
                            >
                             {/* 0:待上架，1:上架中，2:已下架) */}
                                <Option value="">请选择</Option>
                                <Option value="0">待上架</Option>
                                <Option value="1">上架</Option>
                                <Option value="2">已下架</Option>
                            </Select>
                            </Col>
                            <Col span={10}>
                                <p className="searchText">是否有库存</p>
                                <Select
                                showSearch
                                defaultValue="0"
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                value={this.state.hasInventory}
                                onChange={this.hasInventoryChange}
                            >
                                <Option value="">请选择</Option>
                                <Option value="0">有库存</Option>
                                <Option value="1">没有库存</Option>
                            </Select>
                            </Col>
                        </Col>
                        <Col span={12} className="textRight btnBox">
                            <Button type="primary" onClick={this.getGoodsList}>查询</Button>
                            <Button type="primary" className="addBtn" onClick={this.gotoEdit.bind(this)}>新增+</Button>
                        </Col>
                    </Row>
                </div> 
                {/* 顶部搜索结束 */}
                <Table dataSource={this.state.dataSource}  bordered pagination="bottom" size="small" pagination={pagination}  onChange={this.tableChange} rowKey={record=>record.id}>
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
                    <Column align="center" title="商品单价" dataIndex="goodsInventorys" key="goodsInventorys1" 
                        render={goodsInventorys => (
                            <span>
                              {goodsInventorys?
                              goodsInventorys.map((item,index) => (
                                <p key={index} className="tableNum textCenter">￥{item.supplyPrice}</p>
                              )):''}
                            </span>
                          )}
                    />
                     <Column align="center" title="库存" dataIndex="goodsInventorys" key="goodsInventorys2" 
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
                     <Column align="center" title="大分类" dataIndex="goodsCategorys" key="goodsCategorys1" 
                        render={goodsCategorys => (
                            <span>
                              {goodsCategorys?
                              goodsCategorys.map((item,index) => (
                                <p key={index}>{item.level=='1'?item.categoryName:''}</p>
                              )):''}
                            </span>
                          )}
                    />
                     <Column align="center" title="小分类" dataIndex="goodsCategorys" key="goodsCategorys2" 
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
                              {goodsStatus=='1'?'上架':goodsStatus=='0'?'待上架':'下架'}
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
                        <span className="tableDelete" onClick={()=>{this.showModel(id)}}>
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
                <Modal
                title="Modal"
                visible={this.state.visible}
                onOk={this.gotoDelete}
                onCancel={this.hideModal}
                okText="确认"
                cancelText="取消"
                >
                <p>是否删除</p>
                </Modal>
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