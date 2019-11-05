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

        // const fileData = "export default Component.extend({" + "\r" +
        //     "    layout," + "\r" +
        //     "    classNames:['" + comp.name + "']," + "\r" +
        //     "    disabled: false," + "\r" +
        //     "    didInsertElement() {" + "\r" +
        //     "        this._super(...arguments);" + "\r" +
        //     "        if(this.defaultValue) {" + "\r" +
        //     "            this.set('choosedValue',this.defaultValue)" + "\r" +
        //     "        }" + "\r" +
        //     "    }"
        const fileData = `import { isEmpty, typeOf } from '@ember/utils';
                import { isArray } from '@ember/array';
                import echarts from 'echarts';
                import $ from 'jquery';
                import { inject as service } from '@ember/service';
                import { later } from '@ember/runloop';
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
                    getChartIns() {` +" \r" + 
                    "    const selector = `#${this.get('eid')}`,"+" \r" + 
                    `        $el = $(selector),
                            echartInstance = echarts.getInstanceByDom($el[0]);
                        return echartInstance;
                    },
                    generateChartOption(chartConfig, condition) {
                        this.queryData(chartConfig, condition);
                    },
                    queryData(chartConfig, cond) {
                        let qa = cond.queryAddress;
                        new Promise(resolve => {
                            let chartData = [
                                ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                                ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
                                ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
                                ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
                                ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
                            ]
                            resolve(chartData)
                        })`+" \r" + 
                    "        // this.get('ajax').request(`${qa}`, {"+" \r" + 
                    `       //     method: 'GET',
                            //     data: cond.queryBody
                            // })
                            .then(data => {
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
                        const that = this;
                        const chartId = 'line-demo';

                        later(function () {
                            new Promise(resolve => {
                                let chartConfig = {
                                    id: 'line-demo',
                                    config: {
                                        color: ['#57D9A3', '#FF8B00', '#FFE380', '#8777D9'],
                                        xAxis: {
                                            show: true,
                                            type: 'category',
                                            name: '',
                                            axisTick: {
                                                show: true,
                                                alignWithLabel: true
                                            },
                                            axisLine: {
                                                show: true,
                                                lineStyle: {
                                                    type: 'solid',
                                                    color: '#DFE1E6'
                                                }
                                            },
                                            axisLabel: {
                                                show: true,
                                                color: '#7A869A',
                                                fontSize: 14,
                                                lineHeight: 20
                                            }
                                        },
                                        yAxis: {
                                            show: true,
                                            type: 'value',
                                            axisLine: {
                                                show: false
                                            },
                                            axisTick: {
                                                show: false
                                            },
                                            axisLabel: {
                                                show: true,
                                                color: '#7A869A'
                                            },
                                            splitLine: {
                                                show: true,
                                                lineStyle: {
                                                    type: 'dotted',
                                                    color: '#DFE1E6'
                                                }
                                            }
                                        },
                                        tooltip: {
                                            show: true,
                                            trigger: 'axis',
                                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                            },
                                            //TODO 可配置的 formatter
                                            formatter: function (params) {`+" \r" + 
                "                                let title = `<h6>${params[0].axisValue}</h6>`,"+" \r" + 
                `                                    content = params.map(ele => {

                                                        let value = ele.value[ele.seriesIndex + 1]`+" \r" + 
                
                "                                        return `<div>${ele.marker} ${ele.seriesName} ${value}%</div>`"+" \r" + 

                `                                    })

                                                return title + content.join('')
                                            },
                                            backgroundColor: 'rgba(9,30,66,0.54)'
                                        },
                                        legend: {
                                            show: true,
                                            x: 'center',
                                            y: 'top',
                                            orient: 'horizontal',
                                            textStyle: {
                                                fontSize: 14,
                                                color: '#7A869A'
                                            }
                                        },
                                        series: [{
                                            type: 'line'
                                        }, {
                                            type: 'line'
                                        }, {
                                            type: 'line'
                                        }, {
                                            type: 'line'
                                        }]
                                    },
                                    condition: {
                                        queryAddress: '',
                                        queryBody: 'select * from some_table'
                                    }

                                };
                                resolve(chartConfig)
                            })
                                // that.get('ajax').request('somehost', {
                                //     method: 'GET',
                                //     data: chartId
                                // })
                                .then(data => {
                                    if (!isEmpty(data.id) && !isEmpty(data.condition)) {
                                        that.generateChartOption(data.config, data.condition);
                                    }
                                })
                        }, 2000)
                    }
                });`



        return fileDataStart + "\r\n" + fileData + fileDataEnd
    }
    public paintShow(comp: BPComp, i?: number, cI?: string | number) {
        const iComps = comp.components
        const index = i ? i : 0
        const curIn = cI ? cI : 0
        // TODO 可选参数
        const showStart = "{{#" + comp.name + "}}" + "\r"
        const showEnd = "{{/" + comp.name + "}}\r\n"
        const showBody = ""

        return showStart + showBody + showEnd
    }

    public paintHBS() {
        const chartHbs = "{{echarts-chart classNames='chart-container'" + "\r\n" +
        "    elementId=eid" + "\r\n" +
        "    option=result"  + "\r\n" +
        "    onChartReady=(action onChartReady)" + "\r\n" +
        "    opts=opts}}" + "\r\n"

        return chartHbs
    }
}
