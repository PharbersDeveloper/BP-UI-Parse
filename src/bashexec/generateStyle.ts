"use strict"

import * as fs from "fs"
import {CssStyle} from "../components/CssStyle"
import { TotalStyle } from "../components/TotalStyle"
import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

export class GenerateStyle extends BashExec {
    protected styleData: TotalStyle = null

    constructor(styleData: TotalStyle, output: string, name: string) {
        super()
        this.styleData = styleData
        this.args = [output, name]
    }
    public async exec(callback: (code: number) => void) {
        this.genBlueprint(this.styleData, this.args[0], this.args[1])
        if (callback) {
            callback(0)
        }
    }
    // 初始化 addon 下的 blueprint.css
    private async genBlueprint(styleData: TotalStyle, outputPath: string, name: string) {
        const fileDir: string = outputPath + "/" + name + "/addon/styles"

        fs.mkdirSync(fileDir, { recursive: true })

        // 格式化style 类变成一个个类组成的
        phLogger.info("generateStyle")
        const tempData: string = "*,::after,::before {" + "\r" +
            "-webkit-box-sizing: border-box;" + "\r" +
            "box-sizing: border-box;" + "\r" +
            "font-family: system, -apple-system, BlinkMacSystemFont," + "\r" +
            "    'PingFang SC', 'Hiragino Sans GB', 'Segoe UI', 'Roboto', 'Microsoft YaHei'," + "\r" +
            "    'Helvetica Neue', Helvetica, Arial, sans-serif;" + "\r" +
            "}" + "\r"

        fs.writeFileSync(fileDir + "/addon.css", tempData)
        for (let d = 0, len = styleData.styles.length; d < len; d++) {
            this.addStyles(fileDir + "/addon.css", styleData.styles[d])
        }
    }

    private async addStyles(path: string, styleData: CssStyle) {
        const style = styleData
        const styleStart: string = "." + style.description + " {" + "\r"
        const styleEnd: string = "}" + "\r"

        const styleBody = style.key + ":" + style.value + ";" + "\r"

        fs.appendFileSync(path, styleStart + "  " + styleBody + styleEnd)
    }
}
