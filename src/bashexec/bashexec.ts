"use strict"

import { ExecStrategy } from "./execStrategy/bashstrategy"

export abstract class BashExec {
    protected cmd: string
    protected args: string[] = []
    public async exec<T extends ExecStrategy>( type: new() => T  ) {
        const s = new type()
        s.exec(this.cmd, this.args)
    }
}
