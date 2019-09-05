"use strict"

import { BashExec } from "./bashexec"
import { SpawnStrategy } from "./execStrategy/spawnstrategy"

export class EmberAddonExec extends BashExec {
    protected cmd: string = "ember"
    constructor(name: string) {
        super()
        this.args = ["addon", "alfredyang1986", "--skip-npm"]
    }
}
