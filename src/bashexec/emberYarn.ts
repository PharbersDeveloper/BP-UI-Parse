"use strict"

import { BashExec } from "./bashexec"

export class EmberYarnExec extends BashExec {
    protected cmd = "yarn"
    constructor() {
        super()
        this.args = ["install"]
    }
}
