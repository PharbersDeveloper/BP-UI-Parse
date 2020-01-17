"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import BPItem from "../basic/BPItem"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPStackLayout from "./BPStackLayout"
import BPTabBar from "./BPTabBar"

export default class BPTab extends BPItem {
    public currentIndex: number = 0

    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }

    public setCurrentIndex(index: number): void {
        this.currentIndex = index
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
            styleData: this.paintStyle(comp)
        }
        execList.push(new CompExec(options, isShow))
        return execList
    }

    public paintShow(comp: BPComp) {
        const insideComps = comp.components

        let showBody = ""
        // insideComps.forEach((icomp, i) => {
        const tabBar = new BPTabBar(this.output, this.projectName, this.routeName)
        const stackLayout = new BPStackLayout(this.output, this.projectName, this.routeName)

        showBody += tabBar.paintShow(insideComps[0])
        showBody += stackLayout.paintShow(insideComps[1])

        // })
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
            "    currentIndex: 0" + "\r"

        return fileDataStart + fileData + fileDataEnd
    }
}
