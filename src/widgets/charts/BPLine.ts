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
    public updateChart() {
        return `updateChartData(chartConfig, chartData) {
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
        },` + this.calcLinesNumber() + this.depLogic()
    }
    private calcLinesNumber() {
        return 	`calculateLinesNumber(panelConfig, chartData) {
            let linesNumber = chartData[0].length - 1,
                lineConfig = isArray(panelConfig.series) ? panelConfig.series[0] : panelConfig.series,
                series = [...Array(linesNumber)].map(() => {
                    return lineConfig;
                });

            panelConfig.series = series;
            return panelConfig;
        },`
    }
}
