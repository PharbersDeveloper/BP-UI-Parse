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
        const { attrs, styleAttrs } = comp
        const attrsBody = this.showProperties([...attrs, ...styleAttrs], comp)
        // 判断attrs 中是否有 classNames ，如果没有，则使用 className 属性的值
        const isClassNames = attrs.some((attr: IAttrs) => attr.name === "classNames")
        const classNames: string = isClassNames ? "" : `classNames="${comp.className.split(",").join(" ")}"`
        return `{{!--
            <p>在 ember-cli-build 中添加app.import('node_modules/echarts/map/js/china.js');</p>
         --}}
         {{${comp.name} ${classNames} ${attrsBody}}}`
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
            const ajax = this.ajax

            let { prodName, endDate, compName } = this;
            const queryConfig = cond.query
            const qa = queryConfig.address;
            let queryChartSql = "SELECT PROVINCE, AVG(CURR_MKT_SALES_IN_PROV)  " +
            "AS MKT_SALES, AVG(EI_MKT_PROV) AS EI FROM result WHERE MKT " +
            "IN (SELECT MKT FROM result WHERE COMPANY = '" + compName + "' AND " +
            "DATE = " + endDate + " AND PRODUCT_NAME = '" +
            prodName + "') AND COMPANY = '" + compName + "' AND DATE = " +
            endDate + " GROUP BY PROVINCE.keyword"
            const ec = cond.encode;

            ajax.request(qa + '?tag='+ec.tag+'&dimensionKeys=' + ec.dimension, {
                method: 'POST',
                data: JSON.stringify({ "sql": queryChartSql }),
                dataType: 'json'
            }).then(data => {
                const resultData = isArray(data) ? data : [["PROVINCE_NAME", "EI", "PROV_SALES_VALUE"]]
                let length = isArray(resultData[0]) ? resultData[0].length - 1 : 0
                let visualMapMaxArr = resultData.map(ele => typeof ele[length] === "number" ? ele[length] : 0)
                chartConfig.visualMap.max = Math.max.apply(null, visualMapMaxArr)

                this.updateChartData(chartConfig, resultData);
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
        didUpdateAttrs() {
            this._super(...arguments);
            // date / prodName 改变时，将 currentProv 重置为全国。
            let echart = this.getChartIns()
            this.onEvents.click({ name: "全国" }, echart)
            const { dataConfig, dataCondition } = this;
            if (!isEmpty(dataCondition)) {
                this.generateChartOption(dataConfig, dataCondition);
            }
        },
        didInsertElement() {
            this._super(...arguments);

            const chartId = this.eid;
            this.set('chartId', chartId)
            let chartConfPromise = null
            if (isEmpty(this.store)) {
                chartConfPromise = this.get('ajax').request(this.confReqAdd, {
                    method: 'GET',
                    data: chartId
                })
            } else {
                chartConfPromise = this.store.findRecord("chart", chartId)
            }

            chartConfPromise.then(data => {
                const config = data.styleConfigs
                const condition = data.dataConfigs
                if (!isEmpty(data.id) && !isEmpty(condition)) {
                    // 处理提示框
                    let tooltipType = config.tooltip.formatter;

                    if (tooltipType in tooltips) {
                        config.tooltip.formatter = tooltips[tooltipType]
                    } else {
                        delete config.tooltip.formatter
                    }
                    this.setProperties({
                        dataConfig: config,
                        dataCondition: condition
                    });
                    this.generateChartOption(config, condition);
                }
            })
        },`
    }
}
