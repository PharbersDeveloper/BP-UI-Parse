"use strict"

import { BashExec } from "./bashexec"

export class EmberYarnExec extends BashExec {
    protected cmd = "yarn"
    constructor(type: string) {
        super()
        this.args = [type]
    }
}
