"use strict"

import { BasicComponent} from "../components/BasicComponent"
import { BashExec } from "./bashexec"

// original code
// export class EmberGenExec extends BashExec {
//     protected cmd = "ember"
//     constructor(blueprint: string, name: string) {
//         super()
//         this.args = ["g", blueprint, name]
//     }
// }

export class EmberGenExec extends BashExec {
    protected cmd = "ember"
    protected components: BasicComponent[]|string = undefined
    protected type: string = ""
    constructor(blueprint: string, blueprintClass: BasicComponent[]|string) {
        super()
        this.type = blueprint
        this.components = blueprintClass
        // this.args = ["g", blueprint, name]
    }
    public async exec(callback: (code: number) => void) {
        // process.chdir(this.args[0])
        const blueprint = this.type
        const names = this.components

        if (typeof names === "string") {
                this.stg.exec(this.cmd, ["g", blueprint, names], callback)
            } else {
                for (let i = 0, len = names.length; i < len; i++) {
                    this.stg.exec(this.cmd, ["g", blueprint, names[i].blueprintName], callback)
                }
            }

        if (callback) {
            callback(0)
        }
    }
}
