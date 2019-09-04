"use strict"

import { ExecStrategy } from "./execStrategy/bashstrategy"
import { SpawnStrategy } from "./execStrategy/spawnstrategy"

export abstract class BashExec<T extends ExecStrategy> {
    protected cmd: string
    public async exec() {
        const s = new SpawnStrategy()
        s.exec(this.cmd)
    }
}
