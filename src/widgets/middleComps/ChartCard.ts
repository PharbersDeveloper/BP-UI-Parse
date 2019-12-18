"use strict"

import { CompExec } from "../../bashexec/compExec"
import {CompStylesRepaint} from "../../bashexec/compStylesRepaint"
import BPCtx from "../../context/BPCtx"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import { BPBar , BPBarLine, BPChina, BPLine, BPPie, BPRadar, BPScatter, BPStack} from "../charts/charts"
import BPComp from "../Comp"
import ChartCardTitle from "./ChartCardTitle"

export default class ChartCard extends BPWidget {
    public chartList: BPWidget[] = []
    private options: IOptions = null
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)

    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        this.options = {
            comp,
            hbsData: this.paintHBS(),
            logicData: this.paintLogic(comp),
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.paintStyle(comp)
        }
        execList.push(new CompExec(this.options, isShow))

        return execList
    }
    public repaintStyles(comp: BPComp) {
        const execList: any[] = []
        this.options = {
            comp,
            hbsData: this.paintHBS(),
            logicData: this.paintLogic(comp),
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.paintStyle(comp)
        }
        execList.push(new CompStylesRepaint(this.options))

        return execList
    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const { attrs, styleAttrs } = comp

        const attrsBody = attrs.map( (item: IAttrs) => {

            if (item.type === "string" || !item.type) {
                return  `${item.name}: "${item.value}",\n`
            } else if (item.type === "variable") {
                return ``
            } else {
                return  `${item.name}: ${item.value},\n`
            }

        }).join("")
        let styleAttrsBody = ""
        let classNameBindings = ""
        styleAttrs.forEach( (item: IAttrs) => {
            styleAttrsBody += `${item.name}: ${item.value},`
            classNameBindings += `'${item.name}',`
        })
        const fileData = "\n" +
            `export default Component.extend({
                layout,
                classNames:["${comp.name}"],
                ${attrsBody}
                ${styleAttrsBody}
                classNameBindings: [${classNameBindings}],`

        return fileDataStart + fileData + fileDataEnd
    }

    public paintShow(comp: BPComp) {
        const {attrs, styleAttrs} = comp
        const attrsBody = this.showProperties([...attrs, ...styleAttrs])
        const insideComps = comp.components

        const titleConfig = insideComps[0]
        const chartConfig = insideComps[1]

        const title = this.showProperties([...titleConfig.attrs, ...titleConfig.styleAttrs])
        const chart = this.showProperties([...chartConfig.attrs, ...chartConfig.styleAttrs])

        return `{{#${comp.name}  ${attrsBody} as |card|}}
                    {{card.head ${title}}}
                    {{card.body ${chart}}}
                {{/${comp.name}}}`
    }

    public paintHBS() {
        return    `{{yield
            (hash
              head=(component "chart-card-title")
              body=(component chartName)
              provName=provName
              cityName=cityName
              prodName=prodName
              startDate=startDate
              endDate=endDate
            )
          }}`
    }
}
