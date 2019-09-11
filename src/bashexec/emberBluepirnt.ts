"use strict"

import * as fs from "fs"
import phLogger from "../logger/phLogger"
import {BashExec} from "./bashexec"

export class EmberBlueprintExec extends BashExec {
    protected cmd = "ember"
    // 应该是获取 json 文件得知 blueprintname
    constructor(blueprint: string, blueprintName: string) {
        super()
        // this.getPackageJson(inputPath)
        this.args = ["g", blueprint, blueprintName]
    }
    private getPackageJson(path: string) {
        const inputJson = fs.readFileSync(path, "utf-8")
        // this.packjsonData = JSON.parse(packageJson.toString())
        // return JSON.parse(packageJson.toString())
    }
}
