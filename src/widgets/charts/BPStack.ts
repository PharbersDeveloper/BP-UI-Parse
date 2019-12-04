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
