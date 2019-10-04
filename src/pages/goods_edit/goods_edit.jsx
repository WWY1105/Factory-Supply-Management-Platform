import React,{Component} from 'react'
import './goods_edit.less'
import {Row,Col,Button,Select,Input,Upload,message,Icon,Modal} from 'antd'
import {connect} from 'react-redux'
import E from 'wangeditor'
// import * as qiniu from 'qiniu-js'
// import commonObj from '../../assets/js/common'
const { confirm } = Modal;

let editor;
let hashArr=[] ;
let goodDetailhashArr=[]
const { Dragger } = Upload;
const {Option } = Select;
const QINIU_SERVER = 'http://up.qiniu.com';
class GoodsEdit extends Component{
    constructor(){
        super()
        this.state={
            data:{},// 上传控件的token
            //goodsImage:'',// 商品的图片路径
            uptoken:'',
            bigCategoryList0:[],// 一级分类列表
            bigCategoryList1:[],
            bigCategoryList2:[],
            // smallCategoryList:[],
            smallCategoryList0:[],
            smallCategoryList1:[],
            smallCategoryList2:[],
            marketPrice:"",//单价
            previewVisible: false,
            // 传的图片
            fileList:[],
            fileList1:[],
            filterGood:{// 点击编辑传过来的数据
                id:"",
                detail:'',
                goodsName:'',
                unit:'',//单位
                goodsCategorys:[],
                // 规格库存价格数组
                goodsInventorys:[
                    {
                        inventoryNum: 0,// 库存数量
                        supplyPrice : 0, // 价格
                        specifications: '',// 规格,
                        salePrice :0// 销售价格，去掉
                    }
                ],
                deliveryDays:'',
                logisticsFee :'',
                logisticsMode :''
              },
              chooseBigList:[],
              chooseSmallList:[]
        }
    }
    // 双向数据绑定
    handleChange(e,name,arrname,index){
      
        let that=this;
        let val;
        let originFilterGood=this.state.filterGood
        if(arrname){
            // 数组，属性
            originFilterGood[arrname][index][name]=e.target.value;
        }else if(e.target){
             val=e.target.value;
             originFilterGood[name]=val;
        }else{
            originFilterGood[name]=e;
        }
        that.setState({filterGood:originFilterGood});
       
    }
    // --------------------------------------
    componentDidMount(){
        console.log(this.props.history.location.state.filterGood)
        if(this.props.history.location.state.filterGood){
            console.log('执行')
        
        // 选中的大分类-------start
        let chooseBigList=[];
        let chooseSmallList=[];
        this.props.history.location.state.filterGood.goodsCategorys.map((i,j)=>{
                chooseBigList.push(i.categoryId);
                if(i.secondGoodsCategory){
                    chooseSmallList.push(i.secondGoodsCategory.categoryId)
                }else{
                    chooseSmallList.push('')
                }
                
        })
        // 选中的大分类-------end;
         // 主图----start
         let newFileList=this.props.history.location.state.filterGood.goodsImages;
         hashArr=this.props.history.location.state.filterGood.goodsImages;
         let newFileList1=this.props.history.location.state.filterGood.detailImages;
         goodDetailhashArr=this.props.history.location.state.filterGood.detailImages;
         let fileList=[];
         let fileList1=[]
         newFileList.map((i,j)=>{
             let obj={
                name:j,
                uid:'-'+(j+1),
                status:'done',
                url: this.props.imgUrl + i
             }
             fileList.push(obj)
         })
         newFileList1.map((i,j)=>{
             if(i){
                let obj={
                    name:j,
                    uid:'-'+(j+1),
                    status:'done',
                    url: this.props.imgUrl + i
                 }
                 fileList1.push(obj)
             }
            
        })
        // 循环一级分类，获取二级分类
        let promiseAll=[]
        chooseBigList.forEach((i,j)=>{
            promiseAll.push(this.getSmallCategory(i,j));
        })
        Promise.all(promiseAll).then((val)=>{
            console.log('根据大分类获取的小分类')
            console.log(val)
           
            val.forEach((i,index)=>{
                let obj={};
                obj['smallCategoryList'+index]=i;
                this.setState(obj,()=>{
                    console.log('errorerrorerrorerrorerrorerrorerrorerrorerrorerror')
                    console.log(chooseBigList)
                    console.log(chooseSmallList)
                    console.log('smallCategoryList'+index)
                    console.log(this.state['smallCategoryList'+index])
                });
            })
        }).catch((error) => {
            console.log(error)
         })
          // 循环一级分类，获取二级分类---end
        this.setState({chooseBigList,chooseSmallList,fileList1,fileList,filterGood:this.props.history.location.state.filterGood});
      
    }
        this.getBigCategory()
        this.getToken()
       
    }
    shouldComponentUpdate(nextProps,nextState){
        let flag=true;
        if (this.state.smallCategoryList0 !== nextState.smallCategoryList0){
            flag= true;
        }
        return flag;
    }
    // --------------------------------------
    // 获取一级分类
    getBigCategory=()=>{
        window.http('get','business/category/findFistGradeCategories').then((res)=>{
            if(res.data.code=='10000'){
                let result=res.data.content;
                this.setState({ 
                    bigCategoryList0:result,// 一级分类列表
                    bigCategoryList1:result,
                    bigCategoryList2:result});

               
            }else{
                message.error(res.data.message);
            }
        })
    }
    //一级分类改变， 获取二级分类id,index,a
    getSmallCategory=(...arg)=>{
        let originFilterGood=this.state.filterGood;
        let id=arg[0];
        let index=Number(arg[2])
        console.log(arg)
        
        console.log('id'+id)
        console.log("index"+index)
        console.log('chooseBigList')
        console.log(this.state.chooseBigList)
        console.log(originFilterGood.goodsCategorys)
       
        let obj={}
        obj.categoryId=id;
        obj.level='1';
       
        if(originFilterGood.goodsCategorys[index]){
             console.log('已存在，为修改')
            if(id!=originFilterGood.goodsCategorys[index].categoryId){
                console.log('选择项与原来不一样')
                if(originFilterGood.goodsCategorys[index].id){
                    obj.id=originFilterGood.goodsCategorys[index].id;
                }
                if(originFilterGood.goodsCategorys[index].secondGoodsCategory){
                    
                    let id=originFilterGood.goodsCategorys[index].secondGoodsCategory.id;
                   
                    obj.secondGoodsCategory={};
                    obj.secondGoodsCategory.id=id;
                    console.log('哈哈哈哈哈'+id)
                    
                }
                originFilterGood.goodsCategorys[index]=obj;
                console.log(originFilterGood.goodsCategorys[index])
                let chooseSmallList=this.state.chooseSmallList;
                chooseSmallList.splice(index,1,'');
                this.setState({chooseSmallList})
            }
        }else{
            console.log('为存在，是添加')
            originFilterGood.goodsCategorys.push(obj)
        }
        
        let pp=new Promise((resolve,reject)=>{
            window.http('get','business/category/'+id+'/findCategories').then((res)=>{
                if(res.data.code=='10000'){
                    resolve(res.data.content)
                    
                }else{
                    reject('error')
                    message.error(res.data.message);
                }
            })
        })
        pp.then((value)=>{
            let obj1={};
            obj1['smallCategoryList'+index]=value;
            console.log('执行了')
            console.log(obj1)
            this.setState(obj1);
        })
      
        this.setState({filterGood:originFilterGood})
        this.chooseBigListChange(id,index) 
        return pp;
       
    }
    chooseSmallListChange=(id,index)=>{
        let chooseSmallList=this.state.chooseSmallList;
        chooseSmallList.splice(index,1,id);
        this.setState({chooseSmallList})
    }
    chooseBigListChange=(id,index)=>{
        let chooseBigList=this.state.chooseBigList;
        chooseBigList.splice(index,1,id);
        this.setState({chooseBigList})
    }
    // 二级分类改变
    smallCategoryChange=(...arg)=>{
        let originFilterGood=this.state.filterGood;
        //  let goodsCategorys=this.state.goodsCategorys;
        let id=arg[0];
        let index=Number(arg[2])
        let obj={}
        obj.categoryId=id;
        obj.level='2';
        console.log(id)
        console.log(index)
        console.log(originFilterGood.goodsCategorys)
        if(originFilterGood.goodsCategorys[index].secondGoodsCategory){
            console.log('已经有了子类')
            console.log(originFilterGood.goodsCategorys[index].secondGoodsCategory)

            if(id!=originFilterGood.goodsCategorys[index].secondGoodsCategory.categoryId){
                 obj.id=originFilterGood.goodsCategorys[index].secondGoodsCategory.id;// 记录的id
                 console.log(obj)
                originFilterGood.goodsCategorys[index].secondGoodsCategory=obj;
            }
        }else if(originFilterGood.goodsCategorys[index]){
            // alert(1)
            originFilterGood.goodsCategorys[index].secondGoodsCategory=obj;
        }
        this.chooseSmallListChange(id,index) 
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
        let originFilterGood=this.state.filterGood;
        // let goodsInventorys=originFilterGood.goodsInventorys;
        originFilterGood.goodsInventorys.push({
            //goodsId: 0,
            inventoryNum: '',// 库存数量
            supplyPrice : '', // 价格
            specifications: '',// 规格,
            salePrice :0// 销售价格，去掉
        })
        this.setState({filterGood:originFilterGood})
    }
    // 删除规格
    delete_goodsInventorys=(index)=>{
       
            let originFilterGood=this.state.filterGood;
            originFilterGood.goodsInventorys.splice(index,1)
            this.setState({filterGood:originFilterGood})
          
       
    }
    confirm_delete=(index)=>{
        let that=this;
        confirm({
            title: '提示',
            content: '是否删除？',
            onOk() {
                that.delete_goodsInventorys(index)
            },
            onCancel() {},
          });
    }
    beforeUpload=(j)=>{
       this.setState({currentPicIndex:j})
    }
    changeHandler=({file, fileList})=>{   
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
      changeHandler1=({file, fileList})=>{   
        const {uid, name, type, thumbUrl, status, response = {}} = file
        const fileItem = {
        uid,
        name,
        type,
        thumbUrl,
        status,
        url: this.props.imgUrl + (response.hash || '')
        }
        goodDetailhashArr.push(response.hash)
        fileList.pop()
        fileList.push(fileItem)
        this.setState({fileList1:fileList})
        console.log(fileList)
  }
    // 点击大保存
    save_data=()=>{
        
        // console.log(this.state.filterGood);
        let newHashArr;
        let newGoodDetailhashArr;
        let originFilterGood=this.state.filterGood;
        // 主图
        if(hashArr.length>0){
            newHashArr=hashArr.filter((i,j)=>{
                if(i){
                    return true;
                }
            })
            originFilterGood.goodsImage=newHashArr.join(',');
        }
        // 详情图
        if(goodDetailhashArr.length>0){
           newGoodDetailhashArr=goodDetailhashArr.filter((i,j)=>{
                if(i){
                    return true;
                }
            })
            originFilterGood.detail=newGoodDetailhashArr.join(',');
        }
        // 分类处理
        console.log('分类处理')
        console.log(originFilterGood.goodsCategorys)
        let goodsCategorys=[];
        originFilterGood.goodsCategorys.forEach((item)=>{
            if(item.categoryId){
                // 一级分类
                let obj={};
                obj.categoryId=item.categoryId;
                obj.level='1';
                if(item.id){
                    obj.id=item.id;
                }
                goodsCategorys.push(obj)
                if(item.secondGoodsCategory){
                    let obj2={}
                    obj2.categoryId=item.secondGoodsCategory.categoryId;
                    obj2.level='2';
                    obj2.id=item.secondGoodsCategory.id;
                    if(item.secondGoodsCategory.id){
                        obj2.id=item.secondGoodsCategory.id;
                    }
                    goodsCategorys.push(obj2)
                }
            }
        })
        originFilterGood.goodsCategorys=goodsCategorys;
        this.setState({filterGood:originFilterGood})
        let post_data=this.state.filterGood;
          console.log('--------------------')
         console.log(post_data);
         console.log(post_data);
        //  return false;
        let url;
        if(post_data.id){
            // 修改
            url='business/goods/updateGoods'
        }else{
            // 添加
            url='business/goods/addGoods'
        }
        window.http('post',url,post_data,true)
        .then((res)=>{
            if(res.data.code=='10000'){
                message.success('保存成功');
                this.props.history.push({
                    pathname:'/index/commodity_management'
                })
            }else{
                message.error(res.data.message);
            }
        })
    }
    render(){
        const {fileList,fileList1} = this.state
        const uploadProps = {
            onChange:this.changeHandler
        }
        const uploadProps1={
            onChange:this.changeHandler1
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
                            onChange={(...arg)=>{
                                this.getSmallCategory(...arg,'0')
                            }}
                            >
                                {
                                this.state.bigCategoryList0.map((bigItem,bigIndex)=>{
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
                            onChange={(...arg)=>{this.smallCategoryChange(...arg,'0')}}
                            >
                                {
                                this.state.smallCategoryList0.map((bigItem,bigIndex)=>{
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
                            onChange={(...arg)=>{
                                this.getSmallCategory(...arg,'1')
                            }}
                            >
                                {
                                this.state.bigCategoryList1.map((bigItem,bigIndex)=>{
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
                            onChange={(...arg)=>{this.smallCategoryChange(...arg,'1')}}
                            >
                                {
                                this.state.smallCategoryList1.map((bigItem,bigIndex)=>{
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
                            onChange={(...arg)=>{
                                this.getSmallCategory(...arg,'2')
                            }}
                            >
                                {
                                this.state.bigCategoryList2.map((bigItem,bigIndex)=>{
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
                            onChange={(...arg)=>{this.smallCategoryChange(...arg,'2')}}
                            >
                                {
                                this.state.smallCategoryList2.map((bigItem,bigIndex)=>{
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
                    this.state.filterGood.goodsInventorys.map((item,index)=>{
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
                                    <p className="deleteBtn" onClick={()=>{this.confirm_delete(index)}}>删除</p>
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
                                value={this.state.filterGood.logisticsMode+''}
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
                            <Input type="text" value={this.state.filterGood.logisticsFee+''}  onChange={(e)=>{this.handleChange(e,'logisticsFee')}}  className="inputBox"  placeholder="" />

                        </Col>
                        <Col span={8} className="flexBox">
                            <span className="leftText">发货时间</span>
                            <Select
                                showSearch
                                defaultValue="0" 
                                value={this.state.filterGood.deliveryDays+''}
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
                <Row className="goodDetailBox">
                <Upload
                 action={QINIU_SERVER}
                 data={this.state.data}
                 listType='picture-card'
                 className='upload-list-inline'
                 fileList={fileList1}
                 beforeUpload={this.beforeUpload}
                 onPreview={this.handlePreview}
                 className='upload-list-inline'
                 {...uploadProps1}>
                <Button>
                <Icon type="upload" /> 点击上传
                </Button>
                </Upload>
                </Row>
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