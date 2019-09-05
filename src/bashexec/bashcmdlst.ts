"use strict"

import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

export class BashSpwanCmds {
    public cmds?: BashExec[]
    public cur: number = -1
    public exec() {
        if (this.cmds.length > 0) {
            this.cur += 1
            this.execOne()
        }
    }

    private execOne() {
        const tmp = this.cmds[this.cur]
        tmp.exec(this.cmdscb)
    }

    private cmdscb(code: number): void {
        if (code === 0 && this.cmds.length - 1 > this.cur) {
            this.cur += 1
            this.execOne()
        } else if (code === 0) {
            phLogger.info("success")
        } else {
            phLogger.error("error")
        }
    }
}
