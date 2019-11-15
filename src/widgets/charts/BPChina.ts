"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import BPComp from "../Comp"
import BPChart from "./BPChart"

export default class BPChina extends BPChart {

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
    public paintShow(comp: BPComp) {
        const showStart = "<section class='chart-container'>" +
            "<p>需要在ember-cli-build 中添加app.import('node_modules/echarts/map/js/china.js');</p>" +
            "<p>app.import('node_modules/echarts/map/js/province/zhejiang.js');</p>" +
            "{{" + comp.name + " eid='" + comp.id + "'}}</section>"

        return showStart
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
            const queryChartSql = queryConfig.chartSql;
            const ajax = this.ajax;
            const ec = cond.encode;

            chartConfig.tooltip.formatter = function (data) {
                if (data.name === "") {
                    return "此省份暂无数据";
                }
                return data.name + " : " + data.value
            }
            ajax.request(qa + '?tag=chart&x-axis=' + ec.x + '&y-axis=' + ec.y + '&dimensionKeys=' + ec.dimension, {
                method: 'POST',
                data: JSON.stringify({ "sql": queryChartSql }),
                dataType: 'json'
            }).then(data => {
                this.updateChartData(chartConfig, data);
            })
        },` + "\r\n" + this.updateChart()
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
        onDataReady() { },
        onEvents: EmberObject.create({
            click(param, echart) {
                if (param.name === "浙江") {
                    echart.setOption({
                        geo: { map: param.name },
                        series: [{ map: param.name }],
                        dataset: {source: [
                            ['宁波市',6409],
                            ['绍兴市',6000],
                            ['金华市',6818],
                            ['温州市',6408],
                            ['湖州市',6410]
                        ]}
                    })
                } else if(param.name === "湖州市") {
                    $.get('http://127.0.0.1:5555/huzhou', function (huzhou) {
                        echarts.registerMap('湖州市', huzhou);
                        echart.setOption({
                            geo: {
                                map: "湖州市"
                            },
                            series: [{
                                map: '湖州市'
                            }]
                        });
                    });
                } else {
                    echart.setOption({
                        geo: { map: "china" },
                        series: [{ map: "china" }],
                        dataset: {source: [
                            ['浙江',32045]
                        ]}
                    })
                }
            },
            legendselectchanged(param, echart) {
                window.console.log(param, echart);
                alert('chart legendselectchanged');
            }
        }),`
    }
}
