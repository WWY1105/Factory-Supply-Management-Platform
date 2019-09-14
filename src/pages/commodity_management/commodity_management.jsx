import React,{Component} from 'react'
import './commodity_management.less'
import {Row,Col,Button,Select,Table,message} from 'antd'
const { Option } = Select;
const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '主图',
      dataIndex: 'goodsCover ',
      key: 'goodsCover ',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName ',
      key: 'goodsName ',
    },{
        title: '单价',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
      },{
        title: '库存',
        dataIndex: 'inventoryNum  ',
        key: 'inventoryNum  ',
      },{
        title: '单位',
        dataIndex: 'unit ',
        key: 'unit ',
      },
      {
        title: '运费',
        dataIndex: 'logisticsFee ',
        key: 'logisticsFee ',
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
        dataIndex: 'goodsStatus ',
        key: 'goodsStatus ',
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
    gotoEdit(){
        // 跳转编辑页面
        this.props.history.push({
            pathname:'goods_edit'
        })
    }
    // 获取列表
    getGoodsList=()=>{
        console.log('执行了')
        window.http('get','business/goods/findGoodses?pageSize='+this.state.pageSize+"&pageNum="+this.state.pageNum).then((res)=>{
            if(res.data.code=='10000'){
                console.log(res)
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
                <Table dataSource={this.state.dataSource} columns={columns} bordered pagination="bottom"/>;
                
            </div>
        )
    }
}

export default CommodityManagement;