"use strict"

import phLogger from "../logger/phLogger"
import BPComp from "../widgets/Comp"
import BPMainWindow from "../widgets/windows/BPMainWindow"
export default class BPCtx {
    public type: string = ""
    public name: string = ""
    public paintMW(mw: BPMainWindow, components: BPComp[]) {
        phLogger.info("paint mainwindows")
    }
}
