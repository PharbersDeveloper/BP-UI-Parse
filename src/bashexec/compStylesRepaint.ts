"use strict"

import * as fs from "fs"
import phLogger from "../logger/phLogger"
import { CssProperty } from "../properties/CssPerperty"
import { IOptions } from "../properties/Options"
import BPComp from "../widgets/Comp"
import { BashExec } from "./bashexec"

export class CompStylesRepaint extends BashExec {
    protected cmd = "ember"
    private option: IOptions = null
    constructor(option: IOptions) {
        super()
        this.option = option

    }
    public async exec(callback: (code: number) => void) {
        const option = this.option
        this.repaintCompStyles(option.output, option.pName, option.comp)
        this.showComponents(option)

        if (callback) {
            callback(0)
        }
    }

    // 生成 css 类
    private async repaintCompStyles(output: string, projName: string, comp: BPComp) {

        const outputPath = output + "/" + projName + "/addon/styles"
        const existFile: boolean = this.fsExistsSync(outputPath)
        if (!existFile) {
            fs.mkdirSync(outputPath, { recursive: true })
        }
        const stylesData = this.createChainStyles(comp)
        fs.appendFileSync(outputPath + "/addon.scss", stylesData)
    }

    private async showComponents(option: IOptions) {
        const {output, pName, rName, showData} = option
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
    private createChainStyles(comp: BPComp, parent?: string) {
        const className: string  = parent ? `${parent} .${comp.name} ` : `.${comp.name} `
        const styleProperties: CssProperty[] = [...comp.css, ...comp.layout]
        const styleBody = styleProperties.map((prop: CssProperty) => {
            return `    ${prop.key}: ${prop.value};\r`
        }).join("")
        const styles = `${className} {\r${styleBody}}\r`
        const insideStyles: string = comp.components.map((ele) => this.createChainStyles(ele, className)).join("")
        return styles + insideStyles
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
