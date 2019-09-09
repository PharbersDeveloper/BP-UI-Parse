"use strict"

import { BashExec } from "./bashexec"

export class EmberInitExec extends BashExec {
    protected cmd = "ember"
    constructor(name: string) {
        super()
        this.args = ["init", name, "--skip-npm"]
    }
}
