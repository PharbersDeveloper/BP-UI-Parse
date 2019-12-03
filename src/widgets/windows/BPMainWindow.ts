"use strict"

import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class BPMainWindow extends BPWidget {
    public components: BPComp[] = []
    public routeName: string = ""
    constructor() {
        super()
    }
    public paint(ctx: BPCtx) {
        phLogger.info("alfred paint test")
        // phLogger.info(ctx)
        const components: BPComp[] = this.components
        const firstCmds = ctx.cmdStart()
        const bodyCmds = ctx.paintMW(this, components)
        const endCmds = ctx.cmdEnd()
        return [...firstCmds, ...bodyCmds, ...endCmds]

        // return [ ...endCmds]

    }
}
