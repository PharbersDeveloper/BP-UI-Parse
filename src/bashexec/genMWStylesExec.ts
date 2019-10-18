"use strict"

import * as fs from "fs"
import phLogger from "../logger/phLogger"
import BPMainWindow from "../widgets/windows/BPMainWindow"
import { BashExec } from "./bashexec"
export class GenMWStylesExec extends BashExec {
    private route: BPMainWindow = null
    constructor( outputPath: string, projectName: string, route: BPMainWindow) {
        super()
        this.route = route
        this.args = [outputPath, projectName]
    }
    public async exec(callback: (code: number) => void) {
            this.genMWStyles(this.args[0], this.args[1], this.route)
            if (callback) {
            callback(0)
        }
    }
    private async genMWStyles( outputPath: string, projectName: string, route: BPMainWindow) {
        const outPath = outputPath + "/" + projectName + "/tests/dummy/app/styles"

        const containerStart: string = ".bp-" + route.routeName + " {" + "\r"
        let containerBody: string = ""
        const containerEnd: string = "}" + "\r"
        route.css.forEach((css) => {
            containerBody = containerBody + css.key + ":" + css.value + ";\r"
        })
        phLogger.info("-=-=-=-=-=-=-=--=-")
        phLogger.info(outPath)
        fs.appendFileSync(outPath + "/app.css", containerStart + containerBody + containerEnd)

    }

}
