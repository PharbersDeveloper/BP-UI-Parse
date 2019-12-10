"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"
import BPButtonItem from "./BPButtonItem"

export default class BPButtonGroup extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            hbsData: this.paintHBS(),
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
        const iComps = comp.components
        let content = ``

        iComps.forEach((it) => {
            const buttonItem = new BPButtonItem(this.output, this.projectName, this.routeName)
            content += buttonItem.paintShow(it)
        })

        return "{{#" + comp.name + "}}" + content + "{{/" + comp.name + "}}"

    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = `
        import { computed } from '@ember/object';
        export default Component.extend({
            layout,
            tagName:'div',
            classNames:['${comp.name}', 'button-group'],
            content: 'default',
            classNameBindings: [],
            attributeBindings: [],
            currentValue: null,
            `

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        return `
        {{yield}}`
     }
}
