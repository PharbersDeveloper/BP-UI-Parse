"use strict"

import { BashExec } from "./bashexec"

export class EmberAddonExec extends BashExec {
    protected cmd = "ember"
    constructor(name: string) {
        super()
        this.args = ["addon", name, "--skip-npm"]
    }
}
