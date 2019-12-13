"use strict"

import { BashExec } from "./bashexec"

export class EmberYarnExec extends BashExec {
    protected cmd = "yarn"
    constructor(type: string, name: string = "", depPosition: string = "") {
        super()
        if (name) {
            this.args = !depPosition ?  [type, name] : [type, name, depPosition]
        } else {
            this.args = [type]

        }
    }
}
