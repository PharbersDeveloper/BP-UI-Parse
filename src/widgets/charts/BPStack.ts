"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import BPComp from "../Comp"
import BPChart from "./BPChart"

export default class BPStack extends BPChart {

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
        return `	updateChartData(chartConfig, chartData) {
            let stackConfig = this.calcBarsNumber(chartConfig, chartData);

            this.reGenerateChart(stackConfig, chartData);

            this.dataReady(chartData, chartConfig);

            const echartInit = this.getChartIns();

            echartInit.hideLoading();
        },` + this.calcBarsNumber() + this.depLogic()
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
    private calcBarsNumber() {
        return 	`calcBarsNumber(panelConfig, chartData) {
            let barsNumber = chartData[0].length - 1,
                stackConfig = isArray(panelConfig.series) ? panelConfig.series[0] : panelConfig.series,
                series = [...Array(barsNumber)].map(() => {
                    return stackConfig;
                });

            panelConfig.series = series;
            return panelConfig;
        },`
    }
}
