"use strict"

import BPCtx from "../context/BPCtx"
import phLogger from "../logger/phLogger"
import { BPWidget } from "./BPWidget"

export default class BPComp extends BPWidget {
    public type: string = ""
    public name: string = ""
    public text: string = ""
    public paint(ctx: BPCtx) {
        phLogger.info("alfred paint test")
    }
}
