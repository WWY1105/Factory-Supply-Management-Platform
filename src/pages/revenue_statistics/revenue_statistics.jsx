import React,{Component} from 'react'
import {Row,Col,DatePicker,message } from 'antd'
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
            month_value: null,
            date_value: null,
            open: false,
            dayOrderAmount: 0,
            dayOrderCount: 0,
            monthOrderAmount: 0,
            monthOrderCount: 0,
            yearOrderAmount: 0,
            yearOrderCount: 0,
        }
    }
    componentDidMount(){
        console.log(defaultYear,defaultMonth,defaultDay)
    }
    // 获取日期选择器
    changeDatehValue=(v,dateString)=>{
        this.setState({
            date_value: v
        });
        window.http('get','business/order/findOrderStatistics?statisticsDay='+dateString
        ).then((res)=>{
        if(res.data.code=='10000'){

        let {dayOrderAmount,dayOrderCount,}={...res.data.content};
         this.setState({dayOrderAmount,dayOrderCount,})
        }else{
        message.error(res.data.message);
        }
        })
    }
    // 获取月份选择器值
    changeMonthValue = (v,dateString) => {
        this.setState({
            month_value: v
        });
        window.http('get','business/order/findOrderStatistics?statisticsMonth='+dateString
        ).then((res)=>{
        if(res.data.code=='10000'){
            let {
                monthOrderAmount,
                monthOrderCount,
                }={...res.data.content};
                this.setState({
                    monthOrderAmount,
                    monthOrderCount,
                   })
        }else{
        message.error(res.data.message);
        }
        })
      };
    // 年份选择器-----start
    setOpenState = () => {
        this.setState({
          open: !this.state.open
        });
      };
    //   获取年份选择器值
      changeRender = (v) => {
        this.setState({
        year_value:v,
          open: false
        });
        window.http('get','business/order/findOrderStatistics?statisticsYear='+moment(v).format('YYYY')
        ).then((res)=>{
            if(res.data.code=='10000'){
                let {yearOrderAmount,yearOrderCount}={...res.data.content};
                    this.setState({yearOrderAmount,yearOrderCount})
            }else{
            message.error(res.data.message);
            }
        })
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
            onChange={this.changeYearValue}
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
            onChange={this.changeYearValue}
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
                                    <DatePicker value={this.state.date_value} onChange={this.changeDatehValue} defaultValue={moment(defaultYear+'/'+defaultMonth+'/'+defaultDay, dateFormat)}/>
                                </Row>
                            </Col>
                            <Col span={24} className="smallTitle">
                                <Row type="flex" justify="space-between">
                                    <Col span={12} >
                                        <p className="midTitle">日订单数量</p>
                                        <p className="numTitle">{this.state.dayOrderCount}条</p>
                                    </Col>
                                    <Col span={12} >
                                        <p className="midTitle textRight">日订单金额</p>
                                        <p className="numTitle textRight">{this.state.dayOrderAmount}</p>
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
                                    <MonthPicker 
                                    defaultValue={moment(defaultYear+'/'+defaultMonth, monthFormat)} 
                                    format={monthFormat} 
                                    value={this.state.month_value}
                                    onChange={this.changeMonthValue}/>
                                </Row>
                            </Col>
                            <Col span={24} className="smallTitle">
                                <Row type="flex" justify="space-between">
                                    <Col span={12} >
                                        <p className="midTitle">月订单数量</p>
                                        <p className="numTitle">{this.state.monthOrderCount}条</p>
                                    </Col>
                                    <Col span={12} >
                                        <p className="midTitle textRight">月订单金额</p>
                                        <p className="numTitle textRight">{this.state.monthOrderAmount}</p>
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
                                <Row type="flex" justify="space-between">
                                    <Col span={12} >
                                        <p className="midTitle">年订单数量</p>
                                        <p className="numTitle">{this.state.yearOrderCount}条</p>
                                    </Col>
                                    <Col span={12} >
                                        <p className="midTitle textRight">年订单金额</p>
                                        <p className="numTitle textRight">{this.state.yearOrderAmount}</p>
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