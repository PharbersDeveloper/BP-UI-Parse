"use strict"

import { BashExec } from "./bashexec"

export class EmberYarnExec extends BashExec {
    protected cmd = "yarn"
    constructor(type: string, name: string = "") {
        super()
        if (name) {
            this.args = [type, name]
        } else {
            this.args = [type]

        }
    }
}
