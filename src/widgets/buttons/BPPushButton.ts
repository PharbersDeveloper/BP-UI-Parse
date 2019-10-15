"use strict"

import { EmberShowExec } from "../../bashexec/emberShowExex"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPPushButton extends BPWidget {
    private output: string = ""
    private projectName: string = ""
    private routeName: string = ""

    constructor(output: string, name: string, routeName: string) {
        super()
        this.output = output
        this.projectName = name
        this.routeName = routeName

    }
    public paint(ctx: BPCtx, component: BPComp) {
        phLogger.info("alfred paint test")
        return [new EmberShowExec(this.output, this.projectName, this.routeName, component)]
    }
}
