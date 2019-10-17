"use strict"

import { PushButtonExec } from "../../bashexec/widgets/buttons/pushButtonExec"

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
        return [new PushButtonExec(this.output, this.projectName, this.routeName, component)]
    }
}
