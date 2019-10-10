"use strict"

import { BashExec } from "./bashexec"

export class RemoveFolderExec extends BashExec {
    protected cmd = "rm"
    constructor(name: string) {
        super()
        this.args = ["-rf", name]
    }
}
