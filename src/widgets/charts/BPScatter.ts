"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import BPComp from "../Comp"
import BPChart from "./BPChart"

export default class BPScatter extends BPChart {

    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            hbsData: this.paintHBS(),
            logicData: this.paintLogic(comp),
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.paintStyle(comp)
        }
        execList.push(new CompExec(options, isShow))

        return execList
    }
    public updateChart() {
        return `updateChartData(chartConfig, chartData) {

            let mock = [
                ["省份","marketGrowth","prodGrowth","sales"],
                ["山东",28.604,7.7,1111706869],
                ["浙江",31.163,77.4,27662440],
                ["北京",-15.16,-68,1154605773],
                ["台湾",13.670,74.7,10582082],
                ["海南",28.599,75,4986705],
                ["上海",-29.476,77.1,56943299],
                ["内蒙古",31.476,-75.4,78958237],
                ["西藏",2.8666,78.1,254830],
                ["云南",1.777,57.7,870601776],
                ["江西",2.9550,79.1,122249285],
                ["安徽",20.76,67.9,20194354],
                ["河南",-12.087,72,42972254],
                ["湖南",24.021,75.4,3397534],
                ["湖北",43.296,76.8,4240375,],
                ["贵州",-10.088,70.8,38195258,],
                ["山西",1.9349,69.6,147568552,],
                ["陕西",106.70,-67.3,53994605,],
                ["四川",26.424,75.7,57110117],
                ["重庆",-37.062,75.4,252847810]
            ]
            //修改数据顺序需要修改
            // - visualMap.dimension
            // - series.encode.x
            // - series.encode.y
            // - optionWithData 函数体内的 circleRangeArr
            this.reGenerateChart(chartConfig, mock);
            // this.reGenerateChart(chartConfig, chartData);

            this.dataReady(chartData, chartConfig);

            const echartInit = this.getChartIns();

            echartInit.hideLoading();
        },` + this.depLogic()
    }
    public depLogic() {
        return `reGenerateChart(option, chartData) {
            const opts = this.get('opts'),
                echartInstance = this.getChartIns();

            let chartOption = null;

            if (isEmpty(option)) {
                echartInstance.setOption({}, opts);
                return;
            }

            echartInstance.clear();
            chartOption = this.optionWithData(option, chartData);
            echartInstance.setOption(chartOption, opts);
        },
        optionWithData(option, data) {
            option.dataset = { source: data };
            let xAxisColor = option.xAxis.axisLabel.color;
            let yAxisColor = option.yAxis.axisLabel.color;
            if(xAxisColor.length !== 7) {
                option.xAxis.axisLabel.color = new Function('value',"return value === '0'?'#7A869A':'transparent';")
            }
            if(yAxisColor.length !== 7) {
                option.yAxis.axisLabel.color = new Function('value',"return value === '0'?'#7A869A':'transparent';")
            }
            let circleRangeArr = data.map( ele => isNaN(ele[3])?0:ele[3]);
            option.visualMap.max = Math.max.apply(null,circleRangeArr)
            return option;
        },` + this.dataChange()
    }
    public dataChange() {
        return `
        onChartReady(chart) {
            chart.currentCity = this.currentCity
            chart.onChangeCity = function(city) {
                this.set("currentCity",city)
                this.onChangeCity(city)
            }.bind(this)
            chart.showLoading({
                text: '加载中...',
                color: '#FFAB00',
                textColor: '#fff',
                maskColor: 'rgba(9,30,66,0.54)',
                zlevel: 0
            });
        },
        dataReady(chartData, panelConfig) {
            this.onDataReady(chartData, panelConfig);
        },
        onDataReady() { },
        onEvents: EmberObject.create({
            click(param, echart) {
                let clickCity = param.data[0];

                echart.currentCity = clickCity
                echart.onChangeCity(clickCity)
            }
        }),`
    }
    public lifeCycleHooks() {
        return `init() {
            this._super(...arguments);
            this.set('result', {});
            this.set('opts', {
                renderer: 'canvas' // canvas of svg
            });
        },
        didReceiveAttrs() {
            this._super(...arguments);
        },
        didUpdateAttrs() {
            this._super(...arguments);
            const {dataConfig,dataCondition} = this;

            this.generateChartOption(dataConfig, dataCondition);
        },
        didInsertElement() {
            this._super(...arguments);

            const chartId = this.eid;
            this.set('chartId', chartId)
            this.get('ajax').request(this.confReqAdd+'/chartsConfig', {
                method: 'GET',
                data: chartId
            }).then(data => {
                if (!isEmpty(data.id) && !isEmpty(data.condition)) {
                    this.setProperties({
                        dataConfig: data.config,
                        dataCondition: data.condition
                      });
                    this.generateChartOption(data.config, data.condition);
                }
            })
        },`
    }
}
