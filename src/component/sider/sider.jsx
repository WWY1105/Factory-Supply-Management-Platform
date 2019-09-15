import React,{Component} from 'react'
import {Layout, Menu} from 'antd'
import { Link,withRouter  } from 'react-router-dom'
import {setPageTitle} from '../../store/actions'
import {connect }from 'react-redux'


import './sider.less'
const {Sider}=Layout;
class LSider extends Component{
        constructor(props){
            super(props)
            this.state={
                selectedKeys:'',
                menus:[
                    {
                        icon:'icon-zhuye',
                        text:'工厂信息',
                        route:'/factory_Information'
                    },
                    {
                        icon:'icon-changyongfenlei',
                        text:'商品管理',
                        route:'/commodity_management'
                    },
                    {
                        icon:'icon-caidan',
                        text:'订单管理',
                        route:'/order_management'
                    },
                    {
                        icon:'icon-renminbi',
                        text:'营收统计',
                        route:'/revenue_statistics'
                    },
                    {
                        icon:'icon-tixian',
                        text:'提现申请',
                        route:'/application_for_cash'
                    },
                    {
                        icon:'icon-kefu',
                        text:'联系客服',
                        route:'/contact_service'
                    }
                ]
            }
        }
        // 点击菜单
        handleClick(e){
            let key=Number(e.key)-1;
            let menus=this.state.menus;
            let name=this.state.menus[key].text;
            this.props.setPageTitle(name);
            
            this.setState({
                selectedKeys:String(key+1)
            })
        }
        

        componentDidMount(){
            // 获取当前路径来对比，看左边菜单谁应该是激活状态    
            let index;
            let currentMenu=this.state.menus.filter((i,j)=>{
                if(i.route==this.props.location.pathname.substr(6)){
                    index=j+1;
                    return true;
                }
            })
            this.setState({
                selectedKeys:String(index)
            })
            // 获取当前路径来对比，看谁应该是激活状态
        }
        render(){
            
            return (
                <Sider className="LeftSider">
                     <Menu
                            onClick={this.handleClick.bind(this)}
                            style={{ width: 90,textAlign:'center' }}
                            defaultSelectedKeys={['1']}
                            selectedKeys={[this.state.selectedKeys]}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="dark"
                            inlineCollapsed="true"
                            inlineIndent="110"
                        >
                        <Menu.Item className="topMenu" key={0}>
                            <p className="circleBorder"><i className="iconfont icon-tools logoicon"></i></p>
                        </Menu.Item>
                  
                {
                    this.state.menus.map((i,j)=>{
                        return (
                            <Menu.Item title="菜单" key={j+1}>
                                <Link to={'/index'+i.route}>
                                    <p><i  className={"iconfont "+i.icon}></i></p>
                                    <p>{i.text}</p>
                                </Link>
                            </Menu.Item>
      
                        )
                    })
                }
                    </Menu>
                </Sider>
            )
        }
    }
    const mapStateToProps=(state)=>{
        return{
            leftNav:state.leftNav,
            pageTitle:state.pageTitle
        }

    }
    const mapDispatchToProps=(dispatch)=>{
        return {
            setPageTitle(data){
                dispatch(setPageTitle(data))
            }
        }
    }
    
    export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LSider));