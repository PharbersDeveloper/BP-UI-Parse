"use strict"

import { NavMenuExec } from "../../bashexec/widgets/navs/navMenuExec"

import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class BPNavMenu extends BPWidget {
    private output: string = ""
    private projectName: string = ""
    private routeName: string = ""

    constructor(output: string, name: string, routeName: string) {
        super()
        this.output = output
        this.projectName = name
        this.routeName = routeName

    }
    public paint(ctx: BPCtx, comp: BPComp) {
        const execList: any[] = []

        execList.push(new NavMenuExec(this.output, this.projectName, this.routeName, comp))
        return execList
    }
}
