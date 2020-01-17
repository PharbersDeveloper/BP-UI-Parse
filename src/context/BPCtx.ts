"use strict"

import phLogger from "../logger/phLogger"
import BPComp from "../widgets/Comp"
import BPMainWindow from "../widgets/windows/BPMainWindow"

export default class BPCtx {
    public type: string = ""
    public projectName: string = ""
    public paintMW(mw: BPMainWindow, components: BPComp[]): any {
        phLogger.info("paint mainwindows")
    }
    public cmdStart(): any[] {
        return []
    }
    public cmdEnd(): any[] {
        return []
    }
}
