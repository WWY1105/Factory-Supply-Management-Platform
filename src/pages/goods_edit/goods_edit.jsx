import React,{Component} from 'react'
import './goods_edit.less'
import {Row,Col,Button,Select,Input,Upload,message,Form} from 'antd'
import E from 'wangeditor'
import * as qiniu from 'qiniu-js'
import commonObj from '../../assets/js/common'
import {connect} from 'react-redux'
let editor;
const {getBase64,beforeUpload}={...commonObj}
const {Option } = Select;
const QINIU_SERVER = 'http://up.qiniu.com';
const BASE_QINIU_URL = '' ; // 空间 bucket 绑定的域名
class GoodsEdit extends Component{
    constructor(){
        super()
        this.state={
            data:{},// 上传控件的token
            goodsImage:'',// 商品的图片路径
            uptoken:'',
            bigCategoryList:[],// 一级分类列表
            goodsName:"",//商品名称
            unit:'',//单位
            logisticsMode:'',//物流方式
            marketPrice:"",//单价
            inventoryNum:'',//库存
            
            previewVisible: false,
            previewImage: '',
            // 传的图片
            fileList:[],
            // 富文本编辑器内容
            content:'',
            // 规格库存价格数组
            specsList:[
                {
                    goodsId:'' ,
                    inventoryNum: '' ,
                    salePrice : 0 ,
                    specifications : '' ,
                }
            ]

        }
    }
    // 双向数据绑定
    handleChange(e,name){
        console.log('change事件'+e.target.value)
        let that=this;
        let val=e.target.value;
        let obj={};
        obj[name]=val;
        that.setState(obj)
    }
    // --------------------------------------
    componentDidMount(){
        const elem = this.refs.editorElem; //获取editorElem盒子
        const submit = this.refs.submit; //获取提交按钮
        editor = new E(elem)  //new 一个 editorElem富文本
        editor.create();
        editor.customConfig.uploadFileName = 'upfile' //置上传接口的文本流字段
        editor.customConfig.uploadImgServer = 'https://dev.xiaomon.com/api/treeroot/v1/xxx/upload/uploadImage'//服务器接口地址
        editor.txt.html(this.state.content)  //设置富文本默认内容
        editor.customConfig.uploadImgHooks = {
        customInsert: function (insertImg, result, editor) {
            var url = result.url  //监听图片上传成功更新页面
            insertImg(url)
            }
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
        window.http('get','business/category/1/findCategories').then((res)=>{
            if(res.data.code=='10000'){
                // this.setState({bigCategoryList:res.data.content});
                // console.log(this.state.bigCategoryList)
            }else{
                message.error(res.data.message);
            }
        })
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
    }
    beforeUpload=(j)=>{
       this.setState({currentPicIndex:j})
    }
    changeHandler=({file, fileList})=>{   
            let hashArr=[] ;
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
            goodsImage=hashArr.join(',')
            this.setState({goodsImage})
            fileList.pop()
            fileList.push(fileItem)
            this.setState({fileList})
      }
    // 点击大保存
    save_data=()=>{
        let post_data={
            goodsName:this.state.goodsName,
            goodsImage:this.state.goodsImage
        }
        window.http('post','business/goods/addGoods',post_data).then((res)=>{
            if(res.data.code=='10000'){
                message.success('保存成功')
            }else{
                message.error(res.data.message);
            }
        })
        // 编辑器内容
        console.log(editor.txt.html())
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
                        <Input type="text" style={{width:'90%'}}  onChange={(e)=>{this.handleChange(e,'goodsName')}} placeholder="" />
                    </Col>
                    <Col span={4} className="flexBox">
                        <span className="leftText">单位</span>
                        <Input type="text" className="inputBox" onChange={(e)=>{this.handleChange(e,'unit')}} placeholder="" />
                    </Col>
                    <Col span={4} className="flexBox">
                        <span className="leftText">商品ID1234</span>
                    </Col>
                </Row>
            {/* -------------------------------------------- */}
            <Row gutter={50} className="border_b">
                    {
                        this.state.bigCategoryList.map((bigItem,bigIndex)=>{
                            return (
                                <Col span={8} key={bigIndex}>
                                <Row className="textLeft lightTitle">商品类型1</Row>
                                <Row gutter={30}>
                                    <Col span={12} className="flexBox">
                                        <span className="leftText">商品大类</span>
                                        <Select
                                        showSearch
                                        defaultValue="0"
                                        style={{ width:140 }}
                                        optionFilterProp="children"
                                        className="selectBox"
                                        >
                                            <Option value="0">请选择</Option>
                                            <Option value="1">是</Option>
                                            <Option value="2">否</Option>
                                        </Select>
                                    </Col>
                                    <Col span={12} className="flexBox">
                                         <span className="leftText">商品小类</span>
                                         <Select
                                        showSearch
                                        defaultValue="0"
                                        style={{ width:140 }}
                                        optionFilterProp="children"
                                        className="selectBox"
                                       >
                                            <Option value="0">请选择</Option>
                                            <Option value="1">是</Option>
                                            <Option value="2">否</Option>
                                        </Select>      
                                    </Col>
                                </Row>
                            </Col>
                            )
                        })
                    }
                </Row>
            {/* -------------------------------------------- */}
            <Row  className="border_b">
                <Row className="textLeft lightTitle">规格、价格、库存</Row>
                <Row gutter={50}>
                    <Col span={8} className="flexBox">
                        <span className="leftText">规格1</span>
                        <Input type="text" style={{width:'90%'}}  placeholder="" />
                    </Col>
                    <Col span={8}>
                        <Row gutter={30}>
                            <Col span={12} className="flexBox" >
                                <span className="leftText">库存</span>
                                <Input type="number"   className="inputBox" placeholder="" />
                            </Col>
                            <Col span={12} className="flexBox">
                                <span className="leftText">价格（￥）</span>
                                <Input type="number"  className="inputBox"  placeholder="" />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={5}>删除</Col>
                </Row>
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
                               >
                                    <Option value="0">请选择</Option>
                                    <Option value="1">包邮</Option>
                                    <Option value="2">不包邮</Option>
                                </Select>    
                        </Col>
                        <Col span={8} className="flexBox">
                            <span className="leftText">物流费用￥</span>
                            <Input type="text"  className="inputBox"  placeholder="" />

                        </Col>
                        <Col span={8} className="flexBox">
                            <span className="leftText">发货时间</span>
                            <Select
                                showSearch
                                defaultValue="0"
                                style={{ width:140 }}
                                optionFilterProp="children"
                                className="selectBox"
                               >
                                    <Option value="0">请选择</Option>
                                    <Option value="1">立即发货</Option>
                                </Select>    
                        </Col>
                    </Col>
                </Row>
                <Row className="textLeft lightTitle">商品详情</Row>
                <Row>
                    <Col span={16}>
                        <div ref="editorElem"></div>
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