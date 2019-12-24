"use strict"

// import { BPLayout } from "./BPLayout"

// export  class BPRowLayout extends BPLayout {
//     constructor() {
//         super()
//     }
//     protected normals: Array<{key: string, v: any}> = [
//         { key: "display", v: "flex" },
//         { key: "flex-direction", v: "row" },

//     ]
// }

import { CompExec } from "../bashexec/compExec"
import { CompStylesRepaint } from "../bashexec/compStylesRepaint"
import { GenCompList } from "../bashexec/genCompList"
import BPEmberCtx from "../context/BPEmberCtx"
import { RowLayout } from "../layouts/RowLayout"
import phLogger from "../logger/phLogger"
import { IAttrs, IOptions, IReStyleOpt } from "../properties/Options"
import { BPWidget } from "../widgets/BPWidget"
import BPComp from "../widgets/Comp"

export default class BPRowLayout extends BPWidget {
    protected mainLayout: RowLayout
    private options: IOptions = null
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPEmberCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []
        this.mainLayout = new RowLayout()
        comp.css.forEach((c) => this.mainLayout.resetProperty(c.key, c.value, c.tp, c.pe))
        comp.css = this.mainLayout.properties || []

        this.options = {
            comp,
            // hbsData: this.paintHBS(),
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
        const attrsBody = [...attrs, ...styleAttrs].map((item: IAttrs) => {

            if (item.type === "string" || !item.type) {
                return `${item.name}: "${item.value}",\n`
            } else if (item.type === "variable") {
                return ``
            } else {
                return `${item.name}: ${item.value},\n`
            }

        }).join("")
        let classNameBindings = ""

        styleAttrs.forEach((item: IAttrs) => {
            classNameBindings += `"${item.name}",`
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
        const attrsBody = this.showProperties([...attrs, ...styleAttrs],comp)
        // TODO  action / event / state
        const insideComps = comp.components
        const classNames: string = comp.className.split(",").join(" ")
        const compListClass = new GenCompList(this.output, this.projectName, this.routeName)
        const compList = compListClass.createList()
        let showBody: string = ""
        insideComps.forEach((icomp) => {
            const compIns = compList.find((x) => x.constructor.name === icomp.type)
            showBody += compIns.paintShow(icomp)
        })
        return `{{#${comp.name} ${attrsBody}}}
                    ${showBody}
                {{/${comp.name}}}`
    }

}
