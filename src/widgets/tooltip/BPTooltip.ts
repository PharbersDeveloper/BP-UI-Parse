"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPTooltip extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
            super(output, name, routeName)
        }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean) {
        const execList: any[] = []

        const options: IOptions = {
                comp,
                hbsData: this.paintHBS(comp),
                logicData: this.paintLogic(comp), // js
                output: this.output,
                pName: this.projectName,
                rName: this.routeName,
                showData: this.paintShow(comp), // hbs
                styleData: this.paintStyle(comp) //  继承自 BPWidget 的方法, css
        }
        execList.push(new CompExec(options, isShow))

        return execList
        }
    public paintShow(comp: BPComp) {
        return "{{#" + comp.name + "}}" + comp.text + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        // const tooltipClass = comp.attrs.tooltipExtraClass
        const baseClass = comp.attrs.baseClass
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name + " " + baseClass + "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        if (comp.icon) {
            return "{{svg-jar '" + comp.icon + "' width='24px' height='24px' class='icon-pointer' }}"
        }
    }
}
