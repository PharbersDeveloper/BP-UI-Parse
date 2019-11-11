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

        const fileData = `import { isEmpty, typeOf } from '@ember/utils';
        import { isArray } from '@ember/array';
        import echarts from 'echarts';
        import $ from 'jquery';
        import { inject as service } from '@ember/service';

        export default Component.extend({
            layout,
            tagName: '',
            ajax: service(),
            init() {
                this._super(...arguments);
                this.set('result', {});
                this.set('opts', {
                    renderer: 'canvas' // canvas of svg
                });
            },
            onChartReady(chart) {
                chart.showLoading({
                    text: '加载中...',
                    color: '#FFAB00',
                    textColor: '#fff',
                    maskColor: 'rgba(9,30,66,0.54)',
                    zlevel: 0
                });
            },
            getChartIns() {
                const selector = '#' + this.get('eid'),
                    $el = $(selector),
                    echartInstance = echarts.getInstanceByDom($el[0]);
                return echartInstance;
            },
            generateChartOption(chartConfig, condition) {
                this.queryData(chartConfig, condition);
            },
            queryData(chartConfig, cond) {
                const body = cond.queryBody
                const qa = cond.queryAddress;

                // body['chartId'] = this.chartId;

                this.get('ajax').request(qa, {
                    method: 'POST',
                    data: JSON.stringify(body),
                    dataType: 'json'
                }).then(data => {
                    window.console.log(data)
                    this.updateChartData(chartConfig, data);
                });
            },
            updateChartData(chartConfig, chartData) {
                let isLines = chartConfig.series.every((ele) => ele.type === 'line');

                if (!isLines) {
                    this.reGenerateChart(chartConfig, chartData);
                } else {
                    // TODO 这里可以改一下
                    let linesPanelConfig = this.calculateLinesNumber(chartConfig, chartData);

                    this.reGenerateChart(linesPanelConfig, chartData);
                }
                this.dataReady(chartData, chartConfig);

                const echartInit = this.getChartIns();

                echartInit.hideLoading();
            },
            calculateLinesNumber(panelConfig, chartData) {
                let linesNumber = chartData[0].length - 1,
                    lineConfig = isArray(panelConfig.series) ? panelConfig.series[0] : panelConfig.series,
                    series = [...Array(linesNumber)].map(() => {
                        return lineConfig;
                    });

                panelConfig.series = series;
                return panelConfig;
            },
            reGenerateChart(option, chartData) {
                const opts = this.get('opts'),
                    echartInstance = this.getChartIns();

                let chartOption = null;

                if (isEmpty(option)) {
                    echartInstance.setOption({}, opts);
                    return;
                }

                echartInstance.clear();
                chartOption = this.optionWithDate(option, chartData);
                echartInstance.setOption(chartOption, opts);
            },
            optionWithDate(option, data) {
                option.dataset = { source: data };
                return option;
            },
            dataReady(chartData, panelConfig) {
                this.onDataReady(chartData, panelConfig);
            },
            onDataReady() { },
            didReceiveAttrs() {
                this._super(...arguments);
            },
            didInsertElement() {
                this._super(...arguments);
                // 发送请求，请求 chart‘s config
                const chartId = this.eid;
                this.set('chartId', chartId)
                this.get('ajax').request('http://127.0.0.1:5555/chartsConfig', {
                    method: 'GET',
                    data: chartId
                }).then(data => {
                    if (!isEmpty(data.id) && !isEmpty(data.condition)) {
                        this.generateChartOption(data.config, data.condition);
                    }
                })
            }`

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
    
}
