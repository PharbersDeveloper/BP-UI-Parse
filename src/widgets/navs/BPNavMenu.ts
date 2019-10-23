"use strict"

import { NavMenuExec } from "../../bashexec/widgets/navs/navMenuExec"

import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"
import BPPushButton from "../buttons/BPPushButton"
import BPComp from "../Comp"

export default class BPNavMenu extends BPWidget {

    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp) {
        const execList: any[] = []

        execList.push(new NavMenuExec(this.output, this.projectName, this.routeName, comp))
        return execList
    }
    public paintShow(comp: BPComp) {
            const insideComps = comp.components

            // insideComps.forEach((icomp) => {
            //     const navItem = new BPPushButton(this.output, this.projectName, this.routeName)

            // })
            return  "{{#" + comp.name + "}}" + comp.text + "{{/" + comp.name + "}}"
    }
}
