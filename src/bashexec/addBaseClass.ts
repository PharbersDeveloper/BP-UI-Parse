"use strict"

import * as fs from "fs"
import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

export class AddBaseClass extends BashExec {
    protected cmd = "ember"

    constructor(output: string, pName: string) {
        super()
        this.args = [output, pName]
    }
    public async exec(callback: (code: number) => void) {
        const args = this.args
        this.moveBaseStyleClass(args[0], args[1])

        if (callback) {
            callback(0)
        }
    }
    // 根据 bppushbutton 之类的类，修改 components 的属性
    private async moveBaseStyleClass(output: string, pName: string) {
        const outputPath = output + "/" + pName + "/addon/styles/"
        const inputPath = process.argv[1] + "/test/data/styles/base.css"
        const baseStyleClass = fs.readFileSync(inputPath, "utf8")
        fs.writeFileSync(outputPath + "base.css", baseStyleClass)

        const addonStyle = fs.readFileSync(outputPath + "addon.css", "utf8")
        const impData = "@import './base.css';" + "\r"
        fs.writeFileSync(outputPath + "addon.css", impData + addonStyle)

    }

}
