"use strict"

import * as fs from "fs"
import path from "path"
import configResult from "../application/configResult"
import phLogger from "../logger/phLogger"
import BPMainWindow from "../widgets/windows/BPMainWindow"
import { BashExec } from "./bashexec"

export class GenMWStylesExec extends BashExec {
    private route: BPMainWindow = null
    private isAddon: boolean = true
    constructor(outputPath: string, projectName: string, route: BPMainWindow) {
        super()
        this.isAddon = configResult.getIsAddon()
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
        const folderName: string = this.isAddon ? "tests/dummy/app/styles" : "app/styles"
        const outPath = path.resolve(outputPath, projectName, folderName)

        const containerStart: string = ".bp-" + route.routeName + " {" + "\r"
        let containerBody: string = ""
        const containerEnd: string = "}" + "\r"
        route.css.forEach((css) => {
            if (css.pe === "css") {
                containerBody = containerBody + css.key + ":" + css.value + ";\r"
            }
        })
        if (this.isAddon) {
            fs.appendFileSync(outPath + "/app.css", containerStart + containerBody + containerEnd)
        } else {
            fs.appendFileSync(outPath + `/${route.routeName}.scss`, containerStart + containerBody + containerEnd)
        }

        // 伪元素
        let pseudoEleStyle = ""
        route.css.filter((item) => item.pe !== "css").forEach((item) => {
            let pseudoEle: string = ".bp-" + route.routeName + "::" + item.pe + " {" + "\r" + "\n"
            const pseudoStyle = item.key + ": " + item.value + ";" + "\r"
            pseudoEle = pseudoEle + pseudoStyle + "\r" + "}" + "\r"
            pseudoEleStyle += pseudoEle
        })
        if (this.isAddon) {
            fs.appendFileSync(outPath + `/app.css`, pseudoEleStyle)
        } else {
            fs.appendFileSync(outPath + `/${route.routeName}.scss`, pseudoEleStyle)
        }

    }
}
