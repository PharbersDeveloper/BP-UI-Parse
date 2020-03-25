"use strict"

import * as fs from "fs"
import path from "path"
import configResult from "../application/configResult"
import phLogger from "../logger/phLogger"
import { CssProperty } from "../properties/CssPerperty"
import { IReStyleOpt } from "../properties/Options"
import { BashExec } from "./bashexec"

export class CompStylesRepaint extends BashExec {
    protected cmd = "ember"
    private option: IReStyleOpt = null
    private isAddon: boolean = true
    constructor(option: IReStyleOpt) {
        super()
        this.option = option
        this.isAddon = configResult.getIsAddon()
    }
    public async exec(callback: (code: number) => void) {
        const option = this.option
        this.repaintCompStyles(option)
        this.showComponents(option)

        if (callback) {
            callback(0)
        }
    }

    private async repaintCompStyles(option: IReStyleOpt) {
        const { output, pName, styleData } = option
        const folderName: string = this.isAddon ? "addon" : "app"
        const stylePath: string = this.isAddon ? "tests/dummy/app" : "app"
        const outputPath: string = path.resolve(output, pName, stylePath, "styles")
        const filePath: string = outputPath + `/${folderName}.scss`
        const existFile: boolean = this.fsExistsSync(outputPath)
        if (!existFile) {
            fs.mkdirSync(outputPath, { recursive: true })
        }
        try {
            const existData: string = fs.readFileSync(filePath, "utf8")
            if (!this.isAddon && existData === "") {
                fs.appendFileSync(filePath, `
                @import "node_modules/${configResult.getAddonName()}/addon/styles/addon.scss";
                html,body,.ember-application > .ember-view {
                    height: 100%;
                }`)

            }
        } catch (error) {
            if (!this.isAddon) {
                fs.appendFileSync(filePath, `
                @import "node_modules/${configResult.getAddonName()}/addon/styles/addon.scss";
                html,body,.ember-application > .ember-view {
                    height: 100%;
                }`)

            }
        }

        // TODO 由于每个组件都会执行一次此函数
        // 所以会导致组件样式重复书写好多次
        // 在 ember project 中可以根据路由来写样式
        // 在 ember addon 中只对最外层展示组件写，内部通过递归加层级。
        if (!this.isAddon) {
            fs.appendFileSync(filePath, `@import "./${option.rName}.scss";`)
        }

        fs.appendFileSync(filePath, styleData)

    }

    // 在路由中展示当前组件
    private async showComponents(option: IReStyleOpt) {
        const { output, pName, rName, showData } = option
        const folderName: string = this.isAddon ? "tests/dummy/app/templates" : "app/templates"
        const outputPath = path.resolve(output, pName, folderName, `${rName}.hbs`)
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
    private fsExistsSync(dir: string) {
        try {
            fs.accessSync(dir, fs.constants.R_OK | fs.constants.W_OK)
        } catch (err) {
            return false
        }
        return true
    }
}
