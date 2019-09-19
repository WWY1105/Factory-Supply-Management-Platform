import React,{Component} from 'react'
import './contact_service.less'
import imgURL1 from '../../assets/images/Telephone@2x.png';
import imgURL2 from '../../assets/images/wx@2x.png';
import {Row,Col} from 'antd'
class ContactService extends Component{
    render(){
        return (
            <div className="contact_service_box">
                <Row>
                    <Col span={12} className="textCenter flexBox">
                        <img src={imgURL1} alt=""/>
                        <p className="commonText">客服热线</p>
                        <p className="numText">3333333333</p>
                    </Col>
                    <Col span={12} className="textCenter flexBox">
                        <img src={imgURL2} alt=""/>
                        <p className="commonText">微信客服</p>
                        <p className="numText">3333333333</p>
                        <img src='' alt="" className="erImg"/>
                    </Col>
            
                </Row>
            </div>
        )
    }
}

export default ContactService;