"use strict"

import BPMainWindow from "../widgets/windows/BPMainWindow"
import { BashExec } from "./bashexec"

export class EmberCompsExec extends BashExec {
    protected cmd = "ember"
    private routers: BPMainWindow[] = []
    constructor(routers: BPMainWindow[]) {
        super()
        this.routers = routers
    }
    public async exec(callback: (code: number) => void) {
        const routers = this.routers

        for (let i = 0, len = routers.length; i < len; i++) {
            const args: string[] = ["g", "route", "test", "--dummy"]

            this.stg.exec(this.cmd, args, callback)
        }

        if (callback) {
            callback(0)
        }
    }
}
