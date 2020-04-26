"use strict"

import * as fs from "fs"
import path from "path"
import phLogger from "../logger/phLogger"
import { IHelperOptions } from "../properties/HelperOptions"
import { BashExec } from "./bashexec"

export class EmberHelperExec extends BashExec {
    protected cmd = "ember"
    private options: IHelperOptions = null

    constructor(options: IHelperOptions) {
        super()
        this.options = options
    }
    public async exec(callback: (code: number) => void) {
        this.changeCompProperties()
        if (callback) {
            callback(0)
        }
    }
    // 重写：根据 bp-eq/some-belong 不同的helper，修改helper 的逻辑
    private async changeCompProperties() {
        const { output, pName, helperName, logicData } = this.options
        const outputPath = path.resolve(output, pName, "addon/helpers", helperName + ".js")

        fs.writeFileSync(outputPath, logicData)
    }

    private fsExistsSync(dir: string) {
        try {
            fs.accessSync(dir, fs.constants.R_OK | fs.constants.W_OK)
        } catch (err) {
            return false
        }
        return true
    }

}
