"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import BPComp from "../Comp"
import BPChart from "./BPChart"

export default class BPLine extends BPChart {

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
    public mainLogic() {
        return `
        getChartIns() {
            const selector = '#' + this.get('eid'),
                $el = $(selector),
                echartInstance = echarts.getInstanceByDom($el[0]);
            return echartInstance;
        },
        generateChartOption(chartConfig, cond) {
            const {provName,cityName,prodName } = this
            this.chartData(cond, { provName, cityName, prodName }).then(data => {
                this.updateChartData(chartConfig, data);
            })
        },` + "\r\n" + this.updateChart()
    }
    public updateChart() {
        return `updateChartData(chartConfig, chartData) {
            let linesPanelConfig = this.calculateLinesNumber(chartConfig, chartData);

            this.reGenerateChart(linesPanelConfig, chartData);

            this.dataReady(chartData, chartConfig);

            const echartInit = this.getChartIns();

            echartInit.hideLoading();
        },` + this.calcLinesNumber() + this.depLogic()
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
            const { dataConfig, dataCondition } = this;

            if (!isEmpty(dataCondition)) {
                const newConfig = copy(dataConfig,true)

                this.generateChartOption(newConfig, dataCondition);
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
                    const newConfig = copy(config, true)

                    this.generateChartOption(newConfig, condition);
                }
            })
        },`
    }
    private calcLinesNumber() {
        return 	`calculateLinesNumber(panelConfig, chartData) {
            let linesNumber = chartData.length - 1,
            dc = this.dataConfig,
            lineConfig = isArray(dc.series) ? dc.series[0] : dc.series,
            lineColor = lineConfig.itemStyle ? lineConfig.itemStyle.color : "",
            series = [];

        // 线条颜色
        if (lineColor in otherConfCb) {
            series = [...Array(linesNumber)].map((item, index) => {
                let newConfig = copy(lineConfig, true)
                if (index === 0) {
                    newConfig.itemStyle.color = otherConfCb[lineColor]

                    newConfig.lineStyle.color = "#C3DD41"
                    return newConfig
                }
                newConfig.itemStyle.color = otherConfCb[lineColor]

                newConfig.lineStyle.color = "#5CA6EF"

                return newConfig;
            });
        } else {
            series = [...Array(linesNumber)].map(() => {
                return lineConfig;
            });
        }

        panelConfig.series = series;
        return panelConfig;
        },
        `
    }
}
