import React,{Component} from 'react'
import './topBar.less';
class TopBar extends Component{
    constructor(){
        super()
    }
    render(){
        return (
            <div className="topBar">
                <div className="textContent">
                    <div className="left">
                        <p className="bgTitle">工品驿站</p>
                        <p className="enText">Industrial Products  Trading Platform </p>
                    </div>
                    <div className="midLine"></div>
                    <div className="right">
                        <p className="bgTitle">工厂管理平台</p>
                        <p className="enText">
                            Factory Supply Management Platform 
                        </p>
                    </div>
                </div>
           </div>
        )
    }
}

export default TopBar;