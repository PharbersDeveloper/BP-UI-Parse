"use strict"

import { BashExec } from "./bashexec"

export class CdExec extends BashExec {
    protected cmd = "cd"
    constructor(path: string) {
        super()
        this.args = [path]
    }
}
