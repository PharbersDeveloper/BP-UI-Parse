"use strict"

import { CompExec } from "../../bashexec/compExec"
import {CompStylesRepaint} from "../../bashexec/compStylesRepaint"
import BPCtx from "../../context/BPCtx"
import { IAttrs, IOptions , IReStyleOpt} from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class BPText extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    // TODO 去除掉 isShow 参数
    // 生成 组件的 handlebars.hbs / component.js / addon.scss
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions  = {
            comp,
            // hbsData: this.paintHBS(),
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
    public paintStylesShow(comp: BPComp) {
        const execList: any[] = []
        const options: IReStyleOpt = {
            comp,
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.repaintStyles(comp)
        }
        execList.push(new CompStylesRepaint(options))

        return execList
    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const { attrs, styleAttrs } = comp
        // TODO  action / event / state
        const attrsBody = [...attrs, ...styleAttrs].map( (item: IAttrs) => {

            if (item.type === "string" || !item.type) {
                return  `${item.name}: "${item.value}",\n`
            } else if (item.type === "variable") {
                return ``
            } else {
                return  `${item.name}: ${item.value},\n`
            }

        }).join("")
        let classNameBindings = ""
        styleAttrs.forEach( (item: IAttrs) => {
            classNameBindings += `'${item.name}',`
        })

        const fileData = "\n" +
            `export default Component.extend({
                layout,
                classNames:["${comp.name}"],
                ${attrsBody}
                classNameBindings: [${classNameBindings}],`

        return fileDataStart + fileData + fileDataEnd
    }

    public paintShow(comp: BPComp) {
        const { attrs, styleAttrs } = comp
        // TODO  action / event / state
        const attrsBody = this.showProperties([...attrs, ...styleAttrs],comp)

        return `{{#${comp.name} ${attrsBody}}}
                    ${comp.text}
                {{/${comp.name}}}`
    }

}
