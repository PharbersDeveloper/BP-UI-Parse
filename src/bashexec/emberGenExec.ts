"use strict"

import { BashExec } from "./bashexec"

export class EmberGenExec extends BashExec {
    protected cmd = "ember"
    constructor(blueprint: string, name: string) {
        super()
        this.args = ["g", blueprint, name]
    }
}
