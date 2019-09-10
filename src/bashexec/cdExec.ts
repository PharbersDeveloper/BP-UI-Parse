"use strict"

import { BashExec } from "./bashexec"

export class CdExec extends BashExec {
    protected cmd = "cd"
    constructor(path: string) {
        super()
        this.args = [path]
    }

    public async exec(callback: (code: number) => void) {
        process.chdir(this.args[0])
        if (callback) {
            callback(0)
        }
    }
}
