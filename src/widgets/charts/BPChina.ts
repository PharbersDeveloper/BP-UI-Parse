"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
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
        // const showStart = `{{!--
        //         <p>在ember-cli-build 中添加app.import('node_modules/echarts/map/js/china.js');</p>
        //      --}}` +
        //     `{{${comp.name} eid='${comp.id}'}}`

        // return showStart
        const { attrs, styleAttrs } = comp
        const attrsBody = [...attrs, ...styleAttrs].map((item: IAttrs) => {

            switch (item.type) {
                case "string":
                    return ` ${item.name}="${item.value}"`
                case "number":
                case "boolean":
                case "variable":
                case "callback":
                    return ` ${item.name}=${item.value}`
                case "function":
                case "object":
                case "array":
                    return ``
                default:
                    return ` ${item.name}="${item.value}"`
            }
        }).join("")

        return `{{!--
            <p>在ember-cli-build 中添加app.import('node_modules/echarts/map/js/china.js');</p>
         --}}
         {{${comp.name} ${attrsBody}}}`
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
            ajax.request(qa + '?tag=row2line&dimensionKeys=' + ec.dimension, {
                method: 'POST',
                data: JSON.stringify({ "sql": queryChartSql }),
                dataType: 'json'
            }).then(data => {
                let length = data[0].length -1
                let visualMapMaxArr = data.map(ele=>typeof ele[length]==="number"?ele[length]:0)
                chartConfig.visualMap.max = Math.max.apply(null,visualMapMaxArr)

                this.updateChartData(chartConfig, data);
            })
        },` + "\r\n" + this.updateChart()
    }
    public dataChange() {
        return `
        onChartReady(chart) {
            chart.currentProv = this.currentProv
            chart.onChangeProv = function(prov) {
                this.set("currentProv",prov)
                this.onChangeProv(prov)
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
                let clickProv = param.name;
                let currentProv = clickProv
                if(clickProv === echart.currentProv) {
                    currentProv = "全国"
                }
                echart.currentProv = currentProv
                echart.onChangeProv(currentProv)
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
