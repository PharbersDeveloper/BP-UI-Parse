"use strict"

import { BashExec } from "./bashexec"

export class EmberRunExec extends BashExec {
    protected cmd = "ember"
    constructor(port: string = "4200") {
        super()
        this.args = ["s", "-p", port]
    }
}
