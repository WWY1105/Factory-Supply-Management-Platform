import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import './assets/css/iconfont.css';
import Indexpage from './pages/index/index'
import Login from './pages/login/login'
import Register from './pages/register/register'
import ForgetPass from './pages/forgetPass/forgetPass'

import CommodityManagement from './pages/commodity_management/commodity_management'
import ApplicationForCash from './pages/application_for_cash/application_for_cash'
import ContactService from './pages/contact_service/contact_service'
import FactoryInformation from './pages/factory_Information/factory_Information'
import OrderManagement from './pages/order_management/order_management'
import RevenueStatistics from './pages/revenue_statistics/revenue_statistics'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'; 
import { HashRouter,Route ,Switch} from 'react-router-dom'

import store from './store/index';
import './assets/js/fetch.js'

import {Layout} from 'antd';
import TopBar from './component/topBar/topBar'
import {setLeftNav} from './store/actions'
import commonObj from './assets/js/common'
import './index.less'
// import PropTypes from 'prop-types'; 
import {connect }from 'react-redux'
import LSider from './component/sider/sider'
const {changeTab} =  {...commonObj}
const {Footer,Sider,Content,Header}=Layout;

ReactDOM.render(
    (
    <Provider store={store}>
    {/* /opt/gpyz/business */}
        <HashRouter basename='/business'>
            <Switch>
                <Route path='/' exact component={Login}/>
                <Route path='/index' component={Indexpage}>           
                </Route>
                <Route path='/forgetPass' component={ForgetPass}>           
                </Route>
                <Route path='/register' component={Register}>           
                </Route>
               
            </Switch>
        </HashRouter>
    </Provider>
        
       
    ), document.getElementById('root'));

/**
 * <BrowserRouter />其实就是 <Router history={history}>
 * 所以，不需要在额外写history
 * 使用的时候，直接：this.props.history.push()
 */
serviceWorker.unregister();
