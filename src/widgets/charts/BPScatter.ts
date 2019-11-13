"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import BPComp from "../Comp"
import BPChart from "./BPChart"

export default class BPScatter extends BPChart {

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
            let scatterPanelConfig = this.calcScatterNumber(chartConfig, chartData);

            this.reGenerateChart(scatterPanelConfig, chartData);

            this.dataReady(chartData, chartConfig);

            const echartInit = this.getChartIns();

            echartInit.hideLoading();
        },
        calcScatterNumber(panelConfig, chartData) {
            let numbers = chartData.length - 1,
                config = isArray(panelConfig.series) ? panelConfig.series[0] : panelConfig.series,
                series = [...Array(numbers)].map((ele,index) => {
                    let eleConfig = JSON.parse(JSON.stringify(config));

                    eleConfig.encode.y = index+1
                    eleConfig.symbolSize = function (data) {

                        return data[index+1]/5
                    }
                    return eleConfig;
                });

            panelConfig.series = series;
            return panelConfig;
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
            if(option.series.some(item => item.symbolSize)) {
                // TODO some code
            } else {
                const series = option.series.map(ele=> {
                    ele.symbolSize = function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    }
                    return ele
                })
                option.series = series
            }
            return option;
        },` + this.dataChange()
    }
}
