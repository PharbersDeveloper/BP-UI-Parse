"use strict"

import { BashExec } from "./bashexec"
import { SpawnStrategy } from "./execStrategy/spawnstrategy"

export class EmberAddonExec extends BashExec<SpawnStrategy> {
    constructor(name: string) {
        super()
        // this.cmd = "ls" + name
        this.cmd = "ls"
    }
}
