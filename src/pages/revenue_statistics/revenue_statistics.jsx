import React,{Component} from 'react'
import {Row,Col,DatePicker } from 'antd'
import './revenue_statistics.less'
import moment from 'moment';
const { MonthPicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
const defaultDay=new Date().getDate()
const defaultMonth=new Date().getMonth()+1;
const defaultYear=new Date().getFullYear();
class RevenueStatistics extends Component{
    constructor(){
        super()
        this.state={
            year_value: null,
            open: false
        }
    }
    componentDidMount(){
        console.log(defaultYear,defaultMonth,defaultDay)
    }
    // 年份选择器-----start
    setOpenState = () => {
        this.setState({
          open: !this.state.open
        });
      };
    
      changeValue = v => {
        this.setState({
            year_value: v
        });
      };
    
      changeRender = v => {
        this.setState({
            year_value: v,
          open: false
        });
      };
       // 年份选择器-----end
    render(){
        let YearPicker;
        const { open } = this.state;
        if (!open)
        YearPicker= (
            <DatePicker
            mode="year"
            format="YYYY"
            value={this.state.year_value}
            onChange={this.changeValue}
            onPanelChange={this.changeRender}
            onOpenChange={this.setOpenState}
            open={open}
            />
        );
        else {
        YearPicker= (
            <DatePicker
            mode="year"
            format="YYYY"
            value={this.state.year_value}
            onChange={this.changeValue}
            onPanelChange={this.changeRender}
            open={open}
            />
        );
        }
        return (
            <div className="revenue_statistics_box">
                <Row type="flex" justify="center" align="middle">
                    <Col span={8} className="textLeft">
                        <Row type="flex" justify="center">
                            <Col span={24} className="textLeft smallTitle">日期</Col>
                            <Col span={24}>
                                <Row type="flex" justify="center">
                                    <DatePicker defaultValue={moment(defaultYear+'/'+defaultMonth+'/'+defaultDay, dateFormat)}/>
                                </Row>
                            </Col>
                            <Col span={24} className="smallTitle">
                                <Row type="flex" justify="between">
                                    <Col span={12} >
                                        <p className="midTitle">日订单数量</p>
                                        <p className="numTitle">600条</p>
                                    </Col>
                                    <Col span={12} >
                                        <p className="midTitle textRight">日订单金额</p>
                                        <p className="numTitle textRight">12</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8} className="textLeft">
                         <Row type="flex" justify="center">
                            <Col span={24} className="textLeft smallTitle">月份</Col>
                            <Col span={24}>
                                <Row type="flex" justify="center">
                                    <MonthPicker defaultValue={moment(defaultYear+'/'+defaultMonth, monthFormat)} format={monthFormat} />
                                </Row>
                            </Col>
                            <Col span={24} className="smallTitle">
                                <Row type="flex" justify="between">
                                    <Col span={12} >
                                        <p className="midTitle">月订单数量</p>
                                        <p className="numTitle">600条</p>
                                    </Col>
                                    <Col span={12} >
                                        <p className="midTitle textRight">月订单金额</p>
                                        <p className="numTitle textRight">12</p>
                                    </Col>
                                </Row>
                            </Col>
                         </Row> 
                    </Col>
                    <Col span={8} className="textLeft">
                        <Row type="flex" justify="center">
                            <Col span={24} className="textLeft smallTitle">年度</Col>
                            <Col span={24}>
                                <Row type="flex" justify="center">{YearPicker}</Row>
                            </Col>
                            <Col span={24} className="smallTitle">
                                <Row type="flex" justify="between">
                                    <Col span={12} >
                                        <p className="midTitle">年订单数量</p>
                                        <p className="numTitle">600条</p>
                                    </Col>
                                    <Col span={12} >
                                        <p className="midTitle textRight">年订单金额</p>
                                        <p className="numTitle textRight">12</p>
                                    </Col>
                                </Row>
                            </Col>
                            </Row>
                        </Col>
                </Row>
            </div>
        )
    }
}

export default RevenueStatistics;