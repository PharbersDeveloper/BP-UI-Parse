"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class BPChart extends BPWidget {

    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            // hbsData: this.paintHBS(),
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
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = this.importString() + "\r\n" +
            this.basicStrHead() + "\r\n" +
            this.basicProp() + "\r\n" +
            this.lifeCycleHooks() + "\r\n" +
            this.mainLogic() + "\r\n"

        return fileDataStart + "\r\n" + fileData + fileDataEnd
    }
    public paintShow(comp: BPComp) {
        const showStart = "<section class='chart-container'>{{" + comp.name + " eid='" + comp.id + "'}}</section>"

        return showStart
    }
    public paintHBS() {
        const chartHbs = `{{echarts-chart classNames='chart-container'` + "\r\n" +
            `    elementId=eid` + "\r\n" +
            `    option=result` + "\r\n" +
            `    onChartReady=(action onChartReady)` + "\r\n" +
            `    opts=opts}}` + "\r\n"

        return chartHbs
    }
    public importString() {
        return `import { isEmpty, typeOf } from '@ember/utils';
        import { isArray,A } from '@ember/array';
        import echarts from 'echarts';
        import $ from 'jquery';
        import { inject as service } from '@ember/service';
        import { all } from 'rsvp';`
    }
    public basicStrHead() {
        return `export default Component.extend({`
    }
    public basicProp() {
        return `layout,
                tagName: '',
                ajax: service(),
                confReqAdd: "http://127.0.0.1:5555",
                xValues: A([]),`
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
        didInsertElement() {
            this._super(...arguments);

            const chartId = this.eid;
            this.set('chartId', chartId)
            this.get('ajax').request(this.confReqAdd+'/chartsConfig', {
                method: 'GET',
                data: chartId
            }).then(data => {
                if (!isEmpty(data.id) && !isEmpty(data.condition)) {
                    this.generateChartOption(data.config, data.condition);
                }
            })
        },`
    }
    public mainLogic() {
        return `
        getChartIns() {
            const selector = '#' + this.get('eid'),
                $el = $(selector),
                echartInstance = echarts.getInstanceByDom($el[0]);
            return echartInstance;
        },
        generateChartOption(chartConfig, cond) {
            const queryConfig = cond.query
            const qa = queryConfig.address;
            const queryXSql = queryConfig.xSql;
            const queryDimensionSql = queryConfig.dimensionSql;
            const queryChartSql = queryConfig.chartSql;
            const ajax = this.ajax;
            const ec = cond.encode;
            let getXValues = null;
            let chartData = []

            if (isEmpty(this.xValues)) {
                getXValues = this.get('ajax').request(qa + '?tag=array', {
                    method: 'POST',
                    data: JSON.stringify({"sql":queryXSql}),
                    dataType: 'json'
                })
            } else {
                getXValues = new Promise(resolve => {
                    resolve(this.xValues)
                })
            }
            getXValues.then(data => {
                this.set("xValues", data)
                chartData.push(data)
                // query dimension
                return ajax.request(qa + '?tag=array', {
                    method: 'POST',
                    data: JSON.stringify({"sql":queryDimensionSql}),
                    dataType: 'json'
                }).then(data => {
                    return all(data.map(ele => {
                        let reqBody = {
                            "sql": queryChartSql.replace(ec.placeHolder, ele),
                            "x-values": this.xValues
                        }
                        return ajax.request(qa + '?tag=chart&x-axis='+ec.x+'&y-axis='+ec.y+'&dimensionKeys='+ec.dimension, {
                            method: 'POST',
                            data: JSON.stringify(reqBody),
                            dataType: 'json'
                        })
                    }))
                }).then(data => {
                    data.forEach(ele => {
                        chartData.push(ele[1])
                    })
                    chartData[0].unshift(ec.x)
                    this.updateChartData(chartConfig, chartData);
                })
            })
        },` + "\r\n" + this.updateChart()
    }
    public updateChart() {
        return `updateChartData(chartConfig, chartData) {
                    this.reGenerateChart(chartConfig, chartData);

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
            return option;
        },` + this.dataChange()
    }
    public dataChange() {
        return `
        onChartReady(chart) {
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
        onDataReady() { },`
    }
}
