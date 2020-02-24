"use strict"

import * as fs from "fs"
import path from "path"
import { BashExec } from "./bashexec"
const baseFileAddress = "test/data/styles/base.css"
// 将 base.css 的内容移动到项目的 addonName/addon/styles/_base.scss 内。
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
        const outputPath: string = path.resolve(output, pName, "addon/styles")
        const inputPath: string = path.resolve(process.argv[1], baseFileAddress)
        const baseStyleClass = fs.readFileSync(inputPath, "utf8")
        fs.writeFileSync(outputPath + "/_base.scss", baseStyleClass)

        const addonStyle = fs.readFileSync(outputPath + "/addon.scss", "utf8")

        const impData = `@import "./variables.scss";\n@import "./class.scss";
        @import "./mixin.scss";\n@import './base';` + "\r"

        fs.writeFileSync(outputPath + "/addon.scss", impData + addonStyle)

        const appStylePath = path.resolve(output, pName, "app/styles")

        const existAppStyleFile: boolean = this.fsExistsSync(appStylePath)

        if (!existAppStyleFile) {
            fs.mkdirSync(appStylePath, { recursive: true })
        }
        fs.appendFileSync(appStylePath + "/app.scss", "")

    }
    private fsExistsSync(pathDir: string) {
        try {
            fs.accessSync(pathDir, fs.constants.R_OK | fs.constants.W_OK)
        } catch (err) {
            return false
        }
        return true
    }

}
