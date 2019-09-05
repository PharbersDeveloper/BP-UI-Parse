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
        const that = this
        tmp.exec((code: number) => {
            if (code === 0 && that.cmds.length - 1 > that.cur) {
                that.cur += 1
                that.execOne()
            } else if (code === 0) {
                phLogger.info("success")
            } else {
                phLogger.error("error")
            }
        })
    }
}
