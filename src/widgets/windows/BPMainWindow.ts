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
        phLogger.info(ctx)
        const components: BPComp[] = this.components
        ctx.paintMW(this, components)

    }
}
