"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPPushButton from "../buttons/BPPushButton"
import BPComp from "../Comp"

export default class BPTabBar extends BPWidget {
    public currentIndex: number = 0

    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }

    public setCurrentIndex(index: number): void {
        this.currentIndex = index
    }

    public paint(ctx: BPCtx, comp: BPComp) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            logicData: this.paintLogic(comp),
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.paintStyle(comp)
        }
        execList.push(new CompExec(options))
        return execList
    }

    public paintShow(comp: BPComp) {
        const insideComps = comp.components

        let showBody = ""
        insideComps.forEach((icomp) => {
            const navItem = new BPPushButton(this.output, this.projectName, this.routeName)
            showBody += navItem.paintShow(icomp)
        })
        return "{{#" + comp.name + "}}" + showBody + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const fileData = "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name + "']," + "\r" +
            "    classNameBindings:['isColumn:flex-column']," + "\r" +
            "    isColumn: false," + "\r"

        return fileDataStart + fileData + fileDataEnd
    }
}
