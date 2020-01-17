"use strict"

import { BashExec } from "./bashexec"

export class EmberInstallDepExec extends BashExec {
    protected cmd = "ember"
    constructor(name: string, type: string = "-D", enable: string = "") {
        super()
        if (enable === "") {
            this.args = ["install", name, type]
        } else {
            // 只是为了 ember feature:enable jquery-integration
            this.args = [enable, name]
        }
    }
}
