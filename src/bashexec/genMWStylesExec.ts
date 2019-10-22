"use strict"

import * as fs from "fs"
import phLogger from "../logger/phLogger"
import BPMainWindow from "../widgets/windows/BPMainWindow"
import { BashExec } from "./bashexec"
export class GenMWStylesExec extends BashExec {
    private route: BPMainWindow = null
    constructor(outputPath: string, projectName: string, route: BPMainWindow) {
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
    private async genMWStyles(outputPath: string, projectName: string, route: BPMainWindow) {
        const outPath = outputPath + "/" + projectName + "/tests/dummy/app/styles"

        const containerStart: string = ".bp-" + route.routeName + " {" + "\r"
        let containerBody: string = ""
        const containerEnd: string = "}" + "\r"
        route.css.forEach((css) => {
            if (css.pe === "css") {
                containerBody = containerBody + css.key + ":" + css.value + ";\r"
            }
            // containerBody = containerBody + css.key + ":" + css.value + ";\r"
        })
        fs.appendFileSync(outPath + "/app.css", containerStart + containerBody + containerEnd)

        // 伪元素
        let pseudoEleStyle = ""
        route.css.filter((item) => item.pe !== "css").forEach((item) => {
            let pseudoEle: string = ".bp-" + route.routeName + "::" + item.pe + " {" + "\r" + "\n"
            const pseudoStyle = item.key + ": " + item.value + ";" + "\r"
            pseudoEle = pseudoEle + pseudoStyle + "\r" + "}" + "\r"
            pseudoEleStyle += pseudoEle
        })
        fs.appendFileSync(outPath + "/app.css", pseudoEleStyle)

    }
}
