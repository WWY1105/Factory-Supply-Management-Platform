import React,{Component} from 'react'
import './goods_edit.less'
import {Row,Col,Button,Select,Input,Upload,message} from 'antd'
import E from 'wangeditor'
// import * as qiniu from 'qiniu-js'
// import commonObj from '../../assets/js/common'
import {connect} from 'react-redux'
let editor;
let hashArr=[] ;
const { Dragger } = Upload;
const {Option } = Select;
const QINIU_SERVER = 'http://up.qiniu.com';
class GoodsEdit extends Component{
    constructor(){
        super()
        this.state={
            data:{},// 上传控件的token
            goodsImage:'',// 商品的图片路径
            uptoken:'',
            bigCategoryList:[],// 一级分类列表
            smallCategoryList:[],
            goodsId:"",
            goodsName:"",//商品名称
            unit:'',//单位
            logisticsMode:'0',//物流方式
            marketPrice:"",//单价
            inventoryNum:'',//库存
            deliveryDays:'',
            previewVisible: false,
            previewImage: '',
            // 传的图片
            fileList:[],
            // 富文本编辑器内容
            content:'',
            // 规格库存价格数组
            goodsInventorys:[
                {
                    inventoryNum: 0,// 库存数量
                    supplyPrice : 0, // 价格
                    specifications: '',// 规格,
                    salePrice :0// 销售价格，去掉
                  }
            ],
            goodsCategorys: [//商品类型 goodsId: 0,
                // {
                //   categoryId: 0, 
                //   level: 0
                // }
              ],
              filterGood:{},// 点击编辑传过来的数据
              chooseBigList:[],
              chooseSmallList:[]

        }
    }
    // 双向数据绑定
    handleChange(e,name,arrname,index){
        // console.log('change事件'+e.target.value)
        console.log(e)
        let that=this;
        let val;
        let obj={};
        if(arrname){
            let arr=this.state[arrname];
            arr[index][name]=e.target.value;
            this.setState({
                arrname:arr
            })
        }else if(e.target){
             val=e.target.value;
            obj[name]=val;
            that.setState(obj);
        }else if(e){
            obj[name]=e;
            that.setState(obj);
        }
        
    }
    // --------------------------------------
    componentDidMount(){
        console.log(this.props.history.location.state.filterGood)
        if(this.props.history.location.state.filterGood){
            this.setState({filterGood:this.props.history.location.state.filterGood})
        
        // 选中的大分类-------start
        let chooseBigList=[];
        let chooseSmallList=[];
       
        this.props.history.location.state.filterGood.goodsCategorys.map((i,j)=>{
            if(i.level==1){
                chooseBigList.push(i.categoryId)
            }else{
                chooseSmallList.push(i.categoryId)
            }
        })
        // 选中的大分类-------end;
        // 规格、价格、库存-------start
        let goodsInventorys=this.props.history.location.state.filterGood.goodsInventorys;
         // 规格、价格、库存-------end
         // 主图
         let newFileList=this.props.history.location.state.filterGood.goodsImages
         let fileList=[]
         newFileList.map((i,j)=>{
             let obj={
                name:'',
                 ui:'-'+j,
                status:'done',
                url: this.props.imgUrl + i
             }
             fileList.push(obj)
         })
         this.setState({chooseBigList,chooseSmallList,goodsInventorys,fileList});
        console.log('-----------------')
        console.log(fileList)
    }
       
      
        this.getBigCategory()
        this.getToken()
    }
    // --------------------------------------
    // 获取一级分类
    getBigCategory=()=>{
        window.http('get','business/category/findFistGradeCategories').then((res)=>{
            if(res.data.code=='10000'){
                this.setState({bigCategoryList:res.data.content});
                console.log(this.state.bigCategoryList)
            }else{
                message.error(res.data.message);
            }
        })
    }
    // 获取二级分类
    getSmallCategory=(id)=>{
        console.log('获取二级分类')
        let goodsCategorys=this.state.goodsCategorys;
        let obj={}
        obj.categoryId=id;
        obj.level='1';
        goodsCategorys.push(obj)
        console.log(goodsCategorys)
        window.http('get','business/category/'+id+'/findCategories').then((res)=>{
            if(res.data.code=='10000'){
                this.setState({smallCategoryList:res.data.content});
            }else{
                message.error(res.data.message);
            }
        })
        this.setState({goodsCategorys})
        console.log(this.state.goodsCategorys)
    }
    // 二级分类改变
    smallCategoryChange=(id)=>{
        let goodsCategorys=this.state.goodsCategorys;
        let obj={
                categoryId: 0, 
                level: 0
              }
        obj.categoryId=id;
        obj.level='2';
        goodsCategorys.push(obj)
    }
    // 获取上传图片的token
    getToken=()=>{
        window.http('get','business/qiniu/uptoken').then((res)=>{
            if(res.data.code=='10000'){
                let token={content:res.data.content}
                let data={
                    token:res.data.content
                }
                this.setState({
                    uptoken:res.data.content,
                    data:data
                });
              
            }else{
                message.error(res.data.message);
            }
        })
    }
    // 添加库存
    addSpecs=()=>{
        let goodsInventorys=this.state.goodsInventorys;
        goodsInventorys.push({
            //goodsId: 0,
            inventoryNum: '',// 库存数量
            supplyPrice : '', // 价格
            specifications: '',// 规格,
            salePrice :0// 销售价格，去掉
        })
        this.setState({goodsInventorys})


        console.log(this.state.goodsInventorys)
    }
    beforeUpload=(j)=>{
       this.setState({currentPicIndex:j})
    }
    changeHandler=({file, fileList})=>{   
            let goodsImage='';
            const {uid, name, type, thumbUrl, status, response = {}} = file
            const fileItem = {
            uid,
            name,
            type,
            thumbUrl,
            status,
            url: this.props.imgUrl + (response.hash || '')
            }
            hashArr.push(response.hash)
            fileList.pop()
            fileList.push(fileItem)
            this.setState({fileList})
            console.log(fileList)
      }
    // 点击大保存
    save_data=()=>{
       let newHashArr=hashArr.filter((i,j)=>{
           if(i){
               return true;
           }
       })
        let post_data={
            goodsName:this.state.goodsName,
            goodsImage:newHashArr.join(','),
            unit:this.state.unit,
            goodsInventorys:this.state.goodsInventorys,
            detail:'',
            goodsCategorys:this.state.goodsCategorys,
            logisticsFee:this.state.logisticsFee,
            deliveryDays:this.state.deliveryDays,
            logisticsFee :this.state.logisticsFee,
            logisticsMode :this.state.logisticsMode,
            couponAvailable:'0', //hhhh
            maxCouponDeductAmount:'0',
            extended:''
        }
        // console.log(this.state.fileList)
        // console.log(newHashArr)
        window.http('post','business/goods/addGoods',post_data,true)
        .then((res)=>{
            alert(1)
            if(res.data.code=='10000'){
                message.success('保存成功')
            }else{
                message.error(res.data.message);
            }
        })
    }
    render(){
        const {previewVisible, previewImage, fileList} = this.state
        const uploadProps = {
            onChange:this.changeHandler
        }
        const uploadButton = (
            <div  className="eachPic textCenter">
                <p className="iconfont icon-xiangji"></p>
                <p className="text">上传图片</p>
            </div>
        )
        return (
            <div className="goods_edit_Box">
                <Row  gutter={30} className="border_b">
                    <Col span={12} className="flexBox">
                        <span className="leftText">商品名称</span>
                        <Input type="text" style={{width:'90%'}} value={this.state.filterGood.goodsName} onChange={(e)=>{this.handleChange(e,'goodsName')}} placeholder="" />
                    </Col>
                    <Col span={4} className="flexBox">
                        <span className="leftText">单位</span>
                        <Input type="text" className="inputBox" value={this.state.filterGood.unit} onChange={(e)=>{this.handleChange(e,'unit')}} placeholder="" />
                    </Col>
                    <Col span={4} className="flexBox">
                        <span className="leftText">商品ID：{this.state.filterGood.id}</span>
                    </Col>
                </Row>
            {/* -------------------------------------------- */}
            <Row gutter={50} className="border_b">
                    <Col span={8} >
                    <Row className="textLeft lightTitle">商品类型1</Row>
                    <Row gutter={30}>
                        <Col span={12} className="flexBox">
                            <span className="leftText">商品大类</span>
                            <Select
                            showSearch
                            defaultValue={['1']}
                            value={this.state.chooseBigList.length>0?this.state.chooseBigList[0]:''}
                            style={{ width:140 }}
                            optionFilterProp="children"
                            className="selectBox"
                            onChange={this.getSmallCategory}
                            >
                                {
                                this.state.bigCategoryList.map((bigItem,bigIndex)=>{
                                    return (
                                        <Option key={bigIndex} value={bigItem.id}>{bigItem.name}</Option>
                                    )
                                })
                                }
                            </Select>
                        </Col>
                        <Col span={12} className="flexBox">
                                <span className="leftText">商品小类</span>
                                <Select
                            showSearch
                            value={this.state.chooseSmallList.length>0?this.state.chooseSmallList[0]:''}
                            style={{ width:140 }}
                            optionFilterProp="children"
                            className="selectBox"
                            onChange={this.smallCategoryChange}
                            >
                                {
                                this.state.smallCategoryList.map((bigItem,bigIndex)=>{
                                    return (
                                        <Option key={bigIndex} value={bigItem.id}>{bigItem.name}</Option>
                                    )
                                })
                                }
                            </Select>      
                        </Col>
                    </Row>
                </Col>
                <Col span={8} >
                    <Row className="textLeft lightTitle">商品类型2</Row>
                    <Row gutter={30}>
                        <Col span={12} className="flexBox">
                            <span className="leftText">商品大类</span>
                            <Select
                            showSearch
                            value={this.state.chooseBigList.length>1?this.state.chooseBigList[1]:''}
                            style={{ width:140 }}
                            optionFilterProp="children"
                            className="selectBox"
                            onChange={this.getSmallCategory}
                            >
                                {
                                this.state.bigCategoryList.map((bigItem,bigIndex)=>{
                                    return (
                                        <Option key={bigIndex} value={bigItem.id}>{bigItem.name}</Option>
                                    )
                                })
                                }
                            </Select>
                        </Col>
                        <Col span={12} className="flexBox">
                                <span className="leftText">商品小类</span>
                                <Select
                            showSearch
                            value={this.state.chooseSmallList.length>1?this.state.chooseSmallList[1]:''}
                            style={{ width:140 }}
                            optionFilterProp="children"
                            className="selectBox"
                            onChange={this.smallCategoryChange}
                            >
                                {
                                this.state.smallCategoryList.map((bigItem,bigIndex)=>{
                                    return (
                                        <Option key={bigIndex} value={bigItem.id}>{bigItem.name}</Option>
                                    )
                                })
                                }
                            </Select>      
                        </Col>
                    </Row>
                </Col>
                <Col span={8} >
                    <Row className="textLeft lightTitle">商品类型3</Row>
                    <Row gutter={30}>
                        <Col span={12} className="flexBox">
                            <span className="leftText">商品大类</span>
                            <Select
                            showSearch
                            value={this.state.chooseBigList.length>2?this.state.chooseBigList[2]:''}
                            style={{ width:140 }}
                            optionFilterProp="children"
                            className="selectBox"
                            onChange={this.getSmallCategory}
                            >
                                {
                                this.state.bigCategoryList.map((bigItem,bigIndex)=>{
                                    return (
                                        <Option key={bigIndex} value={bigItem.id}>{bigItem.name}</Option>
                                    )
                                })
                                }
                            </Select>
                        </Col>
                        <Col span={12} className="flexBox">
                                <span className="leftText">商品小类</span>
                                <Select
                            showSearch
                            value={this.state.chooseSmallList.length>2?this.state.chooseSmallList[2]:''}
                            style={{ width:140 }}
                            optionFilterProp="children"
                            className="selectBox"
                            onChange={this.smallCategoryChange}
                            >
                                {
                                this.state.smallCategoryList.map((bigItem,bigIndex)=>{
                                    return (
                                        <Option key={bigIndex} value={bigItem.id}>{bigItem.name}</Option>
                                    )
                                })
                                }
                            </Select>      
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/* -------------------------------------------- */}
            <Row  className="border_b">
                <Row className="textLeft lightTitle">规格、价格、库存</Row>
                {
                    this.state.goodsInventorys.map((item,index)=>{
                        return (
                            <Row gutter={50} key={index} style={{marginBottom:20}}>
                                <Col span={8} className="flexBox">
                                    <span className="leftText">规格{index+1}</span>
                                    <Input value={item.specifications} onChange={(e)=>{this.handleChange(e,'specifications','goodsInventorys',index)}} type="text" style={{width:'90%'}}  placeholder="" />
                                </Col>
                                <Col span={8}>
                                    <Row gutter={30}>
                                        <Col span={12} className="flexBox" >
                                            <span className="leftText">库存</span>
                                            <Input type="number" value={item.inventoryNum} onChange={(e)=>{this.handleChange(e,'inventoryNum','goodsInventorys',index)}} className="inputBox" placeholder="" />
                                        </Col>
                                        <Col span={12} className="flexBox">
                                            <span className="leftText">价格（￥）</span>
                                            <Input type="number" value={item.supplyPrice}  className="inputBox" onChange={(e)=>{this.handleChange(e,'supplyPrice','goodsInventorys',index)}}  placeholder="" />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={5}>
                                    <p className="deleteBtn">删除</p>
                                </Col>
                            </Row>
                        )
                    })
                }
                <Row>
                    <Button type="primary" className="addSpecs" onClick={()=>{this.addSpecs()}}>添加规格</Button>
                </Row>
            </Row>
            {/* -------------------------------------------- */}
            <Row className="border_b">
                <Col span={1} className="textLeft lightTitle" style={{minWidth:80}}>上传主图</Col>
                <Col span={11} className="textLeft flexBox">
                {/* 上传图片 */}
                <Upload  
                action={QINIU_SERVER}
                data={this.state.data}
                listType='picture-card'
                className='upload-list-inline'
                fileList={fileList}
                beforeUpload={this.beforeUpload}
                onPreview={this.handlePreview}
                {...uploadProps}
                >
                    {
                        fileList>5?null:uploadButton
                        
                    }
                </Upload>         
                </Col>
            </Row>
            {/* -------------------------------------------- */}
            <Row className="border_b"  gutter={30}>
                <Row className="textLeft lightTitle">配送与物流</Row>
                <Row type="flex" className="delivery_box" gutter={10}>
                    <Col span={12} className="flexBox col">
                        <Col span={8} className="flexBox">
                            <span className="leftText">物流方式</span>
                            <Select
                                showSearch
                                defaultValue="0"
                                style={{ width:140 }}
                                optionFilterProp="children"
                                className="selectBox"
                                onChange={(e)=>{this.handleChange(e,'logisticsMode')}}
                               >
                                    
                                    <Option value="0">包邮</Option>
                                </Select>    
                        </Col>
                        <Col span={8} className="flexBox">
                            <span className="leftText">物流费用￥</span>
                            <Input type="text"  onChange={(e)=>{this.handleChange(e,'logisticsFee')}}  className="inputBox"  placeholder="" />

                        </Col>
                        <Col span={8} className="flexBox">
                            <span className="leftText">发货时间</span>
                            <Select
                                showSearch
                                defaultValue="0"
                                style={{ width:140 }}
                                optionFilterProp="children"
                                className="selectBox"
                                onChange={(e)=>{this.handleChange(e,'deliveryDays')}}
                               >
                                    <Option value="0">立即发货</Option>
                                    <Option value="3">3天发货</Option>
                                    <Option value="7">7天发货</Option>
                                </Select>    
                        </Col>
                    </Col>
                </Row>
                <Row className="textLeft lightTitle">商品详情</Row>
                <Row>
                    <Col span={16}>
                        {/* <div ref="editorElem"></div> */}
                        <Button type="primary" ref="submit" className="saveBtn" onClick={()=>{this.save_data()}}>提交保存</Button>
                    </Col>
                </Row>
            </Row>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        imgUrl:state.imgUrl
    }
}
export default connect(mapStateToProps)(GoodsEdit);