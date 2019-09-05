"use strict"

import { ExecStrategy } from "./execStrategy/bashstrategy"
import { SpawnStrategy } from "./execStrategy/spawnstrategy"

export interface IBashExec<T extends ExecStrategy> {
    exec(callback: (code: number) => void): void
}

export abstract class BashExec implements IBashExec<SpawnStrategy> {
    protected cmd?: string
    protected args?: string[]
    protected stg = new SpawnStrategy()
    public async exec(callback: (code: number) => void) {
        this.stg.exec(this.cmd, this.args, callback)
    }
}
