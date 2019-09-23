"use strict"

import { BasicComponent } from "../components/BasicComponent"
import { BasicUi } from "../components/BasicUi"
import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

export class EmberBlueprintExec extends BashExec {
    protected cmd = "ember"
    private cmds: BasicComponent[] = []
    // 应该是获取 json 文件得知 blueprintname
    constructor(blueprint: BasicUi) {
        super()
        this.cmds = blueprint.components
    }

    public async exec(callback: (code: number) => void) {
        const cmds = this.cmds
        // const uniqBpData = uniqBy(cmds, "blueprintName")
        const uniqBpData = cmds

        phLogger.info("emberBlueprint")

        for (let i = 0, len = uniqBpData.length; i < len; i++) {
            const styles = "addClassNames:" + uniqBpData[i].styles.join()

            const args: string[] = ["g", uniqBpData[i].blueprintName, uniqBpData[i].name, styles]
            this.stg.exec(this.cmd, args, callback)
        }

        if (callback) {
            callback(0)
        }
    }
}
