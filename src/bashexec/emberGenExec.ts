"use strict"

import { BasicComponent } from "../components/BasicComponent"
import { BashExec } from "./bashexec"

// original code
export class EmberGenExec extends BashExec {
    protected cmd = "ember"
    constructor(blueprint: string, name: string, param?: string) {
        super()
        // this.args = ["g", blueprint, name]
        if (param) {
            this.args = ["g", blueprint, name, param]
        } else {
            this.args = ["g", blueprint, name]

        }
    }
}
