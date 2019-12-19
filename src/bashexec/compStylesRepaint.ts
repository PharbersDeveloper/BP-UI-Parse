"use strict"

import * as fs from "fs"
import phLogger from "../logger/phLogger"
import { CssProperty } from "../properties/CssPerperty"
import { IReStyleOpt } from "../properties/Options"
import BPComp from "../widgets/Comp"
import { BashExec } from "./bashexec"

export class CompStylesRepaint extends BashExec {
    protected cmd = "ember"
    private option: IReStyleOpt = null
    constructor(option: IReStyleOpt) {
        super()
        this.option = option

    }
    public async exec(callback: (code: number) => void) {
        const option = this.option
        this.repaintCompStyles(option)
        this.showComponents(option)

        if (callback) {
            callback(0)
        }
    }

    //
    private async repaintCompStyles(option: IReStyleOpt) {
        const {output, pName, styleData} = option
        const outputPath = output + "/" + pName + "/addon/styles"
        const existFile: boolean = this.fsExistsSync(outputPath)
        if (!existFile) {
            fs.mkdirSync(outputPath, { recursive: true })
        }
        // const stylesData = this.createChainStyles(comp)
        fs.appendFileSync(outputPath + "/addon.scss", styleData)
    }

    // 在路由中展示当前组件
    private async showComponents(option: IReStyleOpt) {
        const { output, pName, rName, showData } = option
        const outputPath = output + "/" + pName + "/tests/dummy/app/templates/" + rName + ".hbs"
        const hbsData = fs.readFileSync(outputPath, "utf8")
        let containerStart: string = ""
        const containerBody = showData
        const containerEnd = "</div>"

        if (hbsData === "{{outlet}}") {
            containerStart = "<div class='bp-" + rName + "'>"
        } else {
            containerStart = hbsData.split("</div>")[0]
        }
        fs.writeFileSync(outputPath, containerStart + containerBody + containerEnd)
    }
    private fsExistsSync(path: string) {
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK)
        } catch (err) {
            return false
        }
        return true
    }
}
