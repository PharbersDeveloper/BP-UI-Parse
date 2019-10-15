"use strict"

import phLogger from "../logger/phLogger"
import BPComp from "../widgets/Comp"

export default class BPCtx {
    public type: string = ""
    public name: string = ""
    public paintMW(name: string, components: BPComp[]) {
        phLogger.info("paint mainwindows")
    }
}
