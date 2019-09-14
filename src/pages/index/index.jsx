import React,{Component} from 'react'
import store from '../../store/index'
import emitter from '../../util/events'
import commonObj from '../../assets/js/common'
import './index.less'
import CommodityManagement from '../../pages/commodity_management/commodity_management'
import ApplicationForCash from '../../pages/application_for_cash/application_for_cash'
import ContactService from '../../pages/contact_service/contact_service'
import FactoryInformation from '../../pages/factory_Information/factory_Information'
import OrderManagement from '../../pages/order_management/order_management'
import RevenueStatistics from '../../pages/revenue_statistics/revenue_statistics'
import GoodsEdit from '../../pages/goods_edit/goods_edit'
// import PropTypes from 'prop-types'; 
import {connect }from 'react-redux'
import LSider from '../../component/sider/sider'
// import history from '../../history'
// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import {Layout} from 'antd';
import TopBar from '../../component/topBar/topBar'
import {setLeftNav} from '../../store/actions'
import { BrowserRouter,Route ,Switch} from 'react-router-dom'
const {changeTab} =  {...commonObj}
const {Footer,Sider,Content,Header}=Layout;
class Index extends Component {
    constructor(props) {
        super(props)
        this.state =  {
        }
    
    }
    componentDidMount() {
   
        
    }

    componentWillMount() {
        
    }


    render() {
       
        
        
        return (  
             <div className="indexBox">
                            <Layout>
                                <LSider></LSider>
                                <Layout>
                                    <Header>
                                        <TopBar></TopBar>
                                    </Header>
                                    <Content>
                                        <div className="contentBox">
                                            <p className="contentTitle">{store.getState().pageTitle}</p>
                                            <div className='content'>
                                                <Switch>
                                                    <Route exact path='/index/factory_Information' component={FactoryInformation}/>
                                                    <Route exact path='/index/contact_service' component={ContactService}/>
                                                    <Route exact path='/index/commodity_management' component={CommodityManagement}/>
                                                    <Route exact path='/index/application_for_cash' component={ApplicationForCash}/>
                                                    <Route exact path='/index/order_management' component={OrderManagement}/>
                                                    <Route exact path='/index/revenue_statistics' component={RevenueStatistics}/>
                                                    <Route exact path='/index/goods_edit' component={GoodsEdit}/>
                                                </Switch>
                                            </div>
                                        </div>
                                    </Content>
                                </Layout>
                            </Layout>
                        </div>
            )
    }
}
//mapStateToProp :将state映射到组件的props中
const mapStateToProps = (state) =>  {
    // state 打印出来是reducer
    return {
         leftNav:state.leftNav, 
         pageTitle:state.pageTitle
      
    }
  }
  // mapDispatchToProps：将action映射到组件的props中
const mapDispatchToProps = (dispatch, ownProps) =>  {
    return {
        // setGradeList () {
        //   dispatch(setGradeList())
        // }
    }
  }


//   ------------------------------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(Index); 
