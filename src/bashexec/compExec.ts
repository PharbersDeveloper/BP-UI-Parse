"use strict"

import * as fs from "fs"
import path from "path"
import phLogger from "../logger/phLogger"
import { IOptions } from "../properties/Options"
import { BashExec } from "./bashexec"

export class CompExec extends BashExec {
    protected cmd = "ember"
    private options: IOptions = null
    private isShow: boolean = false

    constructor(options: IOptions, isShow: boolean) {
        super()
        this.options = options
        this.isShow = isShow
    }
    public async exec(callback: (code: number) => void) {
        this.changeCompProperties()
        this.addCompStyles()
        this.changeHBSFile()
        if (this.isShow) {
            this.showComponents(this.options)
        }
        if (callback) {
            callback(0)
        }
    }
    // 根据 bppushbutton 之类的类，修改 components 的属性
    private async changeCompProperties() {
        const { output, pName, comp, logicData } = this.options
        const outputPath = path.resolve(output, pName, "addon/components", comp.name + ".js")

        fs.writeFileSync(outputPath, logicData)
    }
    // 修改 handlebars
    private async changeHBSFile() {
        const { output, pName, comp, hbsData } = this.options

        const outputPath = path.resolve(output, pName, "addon/templates/components", comp.name + ".hbs")

        const hbsDataResult = hbsData ? hbsData : "{{yield}}"

        fs.writeFileSync(outputPath, hbsDataResult)
    }
    // 生成 css 类
    private async addCompStyles() {
        const { output, pName, styleData } = this.options

        const outputPath = path.resolve(output, pName, "addon/styles")
        const existFile: boolean = this.fsExistsSync(outputPath)
        if (!existFile) {
            fs.mkdirSync(outputPath, { recursive: true })
        }

        fs.appendFileSync(outputPath + "/addon.scss", styleData)
    }
    private fsExistsSync(dir: string) {
        try {
            fs.accessSync(dir, fs.constants.R_OK | fs.constants.W_OK)
        } catch (err) {
            return false
        }
        return true
    }
    // 展示 components
    private async showComponents(options: IOptions) {
        const outputPath = path.resolve(options.output, options.pName, "/tests/dummy/app/templates/" + options.rName + ".hbs")
        const hbsData = fs.readFileSync(outputPath, "utf8")
        let containerStart: string = ""
        const containerBody = options.showData
        const containerEnd = "</div>"

        if (hbsData === "{{outlet}}") {
            containerStart = "<div class='bp-" + options.rName + "'>"
        } else {
            containerStart = hbsData.split("</div>")[0]
        }
        fs.writeFileSync(outputPath, containerStart + containerBody + containerEnd)
    }
}
