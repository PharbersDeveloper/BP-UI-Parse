"use strict"

import { TabBarExec } from "../../bashexec/widgets/navs/tabBarExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
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
        const output = this.output
        const projectName = this.projectName
        const routeName = this.routeName

        const showData = this.paintShow(comp)

        execList.push(new TabBarExec(output, projectName, routeName, comp, showData))
        return execList
    }
    public paintShow(comp: BPComp) {
            const insideComps = comp.components

            let showBody = ""
            insideComps.forEach((icomp) => {
                const navItem = new BPPushButton(this.output, this.projectName, this.routeName)
                showBody += navItem.paintShow(icomp)
            })
            return  "{{#" + comp.name + "}}" + showBody + "{{/" + comp.name + "}}"
    }
}
