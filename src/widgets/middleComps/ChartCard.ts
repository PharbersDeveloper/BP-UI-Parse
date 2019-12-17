"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import { IOptions } from "../../properties/Options"
import {IAttrs} from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import { BPBar , BPBarLine, BPChina, BPLine, BPPie, BPRadar, BPScatter, BPStack} from "../charts/charts"
import BPComp from "../Comp"
import ChartCardTitle from "./ChartCardTitle"

export default class ChartCard extends BPWidget {
    public chartList: BPWidget[] = []
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
        this.chartList = [
            new BPLine(output, this.projectName, routeName),
            new BPBar(output, this.projectName, routeName),
            new BPPie(output, this.projectName, routeName),
            new BPScatter(output, this.projectName, routeName),
            new BPChina(output, this.projectName, routeName),
            new BPBarLine(output, this.projectName, routeName),
            new BPRadar(output, this.projectName, routeName),
            new BPStack(output, this.projectName, routeName)
        ]
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            hbsData: this.paintHBS(comp),
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
        const { attrs } = comp

        const attrsBody = attrs.map( (item: IAttrs) => {

            if (item.type === "string" || !item.type) {
                return  `${item.name}: "${item.value}",\n`
            } else {
                return  `${item.name}: ${item.value},\n`
            }

        }).join("")
        const fileData = "\n" +
            `export default Component.extend({
                layout,
                classNames:["${comp.name}"],
                ${attrsBody}`

        return fileDataStart + fileData + fileDataEnd
    }

    public paintShow(comp: BPComp) {
        const {attrs, styleAttrs} = comp
        const attrsBody = [...attrs, ...styleAttrs].map( (item: IAttrs) => {

            switch (item.type) {
                case "string":
                    return ` ${item.name}= "${item.value}"`
                case "number":
                case "boolean":
                    return ` ${item.name}= ${item.value}`
                case "function":
                case "object":
                case "array":
                    return ``
                default:
                    return ` ${item.name}= "${item.value}"`
            }
        }).join("")

        return `{{${comp.name} ${attrsBody}}}`
    }

    public paintHBS(comp: BPComp) {
        const insideComps = comp.components

        let showBody = ""
        const chartConfig = insideComps[1]

        const title = new ChartCardTitle(this.output, this.projectName, this.routeName)
        const chartIns = this.chartList.find((x) => x.constructor.name === chartConfig.type)

        showBody += title.paintShow(insideComps[0])
        showBody += chartIns.paintShow(chartConfig)

        return showBody
    }

}
