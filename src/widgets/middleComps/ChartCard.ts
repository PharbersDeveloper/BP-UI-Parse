"use strict"

import { CompExec } from "../../bashexec/compExec"
import {CompStylesRepaint} from "../../bashexec/compStylesRepaint"
import BPCtx from "../../context/BPCtx"
import { IAttrs, IOptions , IReStyleOpt} from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class ChartCard extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    // TODO 去除掉 isShow 参数
    // 生成 组件的 handlebars.hbs / component.js / addon.scss
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions  = {
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
    // 生成当前组件实例的样式，通过 comp.className 属性（或 comp.name）
    // 以及将样式数据写入 addon.scss
    // 同时在 dummy 中生成展示，供之后项目中使用参考。
    // public paintStylesShow(comp: BPComp) {
    //     const execList: any[] = []
    //     const options: IReStyleOpt = {
    //         comp,
    //         output: this.output,
    //         pName: this.projectName,
    //         rName: this.routeName,
    //         showData: this.paintShow(comp),
    //         styleData: this.repaintStyles(comp)
    //     }
    //     execList.push(new CompStylesRepaint(options))

    //     return execList
    // }
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
