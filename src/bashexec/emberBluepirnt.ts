"use strict"

import { BasicComponent } from "../components/BasicComponent"
import { BasicUi } from "../components/BasicUi"
// import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

export class EmberBlueprintExec extends BashExec {
    protected cmd = "ember"
    private cmds: BasicComponent[] = []
    // 应该是获取 json 文件得知 blueprintname
    constructor(blueprint: BasicUi) {
        super()
        this.cmds = blueprint.components
        // this.getPackageJson(inputPath)
        // this.args = ["g", blueprint.components[0].blueprintName, blueprint.components[0].name]
    }
    public async exec(callback: (code: number) => void) {

        const cmds = this.cmds
        for (let i = 0, len = cmds.length; i < len; i++) {
            const args: string[] = ["g", cmds[i].blueprintName, cmds[i].name]
            this.stg.exec(this.cmd, args, callback)
        }

        if (callback) {
            callback(0)
        }
    }
}
