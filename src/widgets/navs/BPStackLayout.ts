"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import BPItem from "../basic/BPItem"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class BPStackLayout extends BPWidget {
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
            styleData: this.paintStyle(comp),
        }
        execList.push(new CompExec(options, isShow))

        return execList
    }
    public paintShow(comp: BPComp) {
        const insideComps = comp.components

        let showBody = ""
        insideComps.forEach((icomp, i) => {
            const item = new BPItem(this.output, this.projectName, this.routeName)
            showBody += item.paintShow(icomp, i, "stack.currentIndex")
        })
        return "{{#" + comp.name + " as |stack|}}" + showBody + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = "\n" +
        "export default Component.extend({" + "\r" +
        "    layout," + "\r" +
        "    classNames:['" + comp.name + "']," + "\r" +
        "    currentIndex: 0" + "\r"

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
       return "{{yield (hash currentIndex=currentIndex)}}"
    }
}
