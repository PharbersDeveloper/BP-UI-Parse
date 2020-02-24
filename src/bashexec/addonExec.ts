"use strict"

import configResult from "../application/configResult"
import { BashExec } from "./bashexec"

export class EmberAddonExec extends BashExec {
    protected cmd = "ember"
    constructor(name: string) {
        super()
        if (configResult.getIsAddon()) {
            this.args = ["addon", name, "--skip-npm"]
        } else {
            this.args = ["new", name, "--skip-npm", "--no-welcome"]
        }

    }
}
