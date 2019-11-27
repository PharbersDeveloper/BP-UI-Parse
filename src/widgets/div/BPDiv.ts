"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class BPDiv extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
  }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            logicData: this.paintLogic(comp),
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.paintStyle(comp) //  继承自 BPWidget 的方法
        }
        execList.push(new CompExec(options, isShow))

        return execList
    }

    public paintShow(comp: BPComp) {
        const insideComps = comp.components

        if (insideComps.length !== 0) {

            let showBody = ""
            insideComps.forEach((icomp) => {
                // const type = icomp.type
                // 识别子组件的类型后生成对应的组件，div 中应该包含多种类型组件
                // const innerDiv = new BPDiv(this.output, this.projectName, this.routeName)
                // const innerComp = "{{#" + icomp.name + "}}" + icomp.text + "{{/" + icomp.name + "}}"
                const innerComp = this.paintShow(icomp)
                showBody += innerComp
            })
            return "{{#" + comp.name + "}}" + showBody + "{{/" + comp.name + "}}"
        }

        return "{{#" + comp.name + "}}" + comp.text + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const specialClass = comp.attrs.specialClass ? comp.attrs.specialClass : ""

        const fileData = "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name + "', '" + specialClass + "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'rseverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['disabled']," + "\r"

        return fileDataStart + fileData + fileDataEnd
    }
}
