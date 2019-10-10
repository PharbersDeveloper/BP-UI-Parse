"use strict"

import { BashExec } from "./bashexec"

export class EmberInstallDepExec extends BashExec {
    protected cmd = "ember"
    constructor(name: string, type: string = "-D") {
        super()
        this.args = ["install", name, type]
    }
}
