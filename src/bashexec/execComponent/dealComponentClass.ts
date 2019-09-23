"use strict"

import * as fs from "fs"
import { BasicUi } from "../../components/BasicUi"
import phLogger from "../../logger/phLogger"
import { BashExec } from "../bashexec"

export class DealComponentClass extends BashExec {
    protected blueprint: BasicUi = null

    constructor(blueprint: BasicUi, output: string, name: string) {
        super()
        this.blueprint = blueprint
        this.args = [output, name]

    }
    public async exec(callback: (code: number) => void) {

        await this.dealComponentClass(this.blueprint, this.args[0], this.args[1])
        if (callback) {
            callback(0)
        }
    }
    // 为 component logic file 添加 classNames 属性
    private async dealComponentClass(blueprint: BasicUi, outputPath: string, name: string) {
        const fileDir: string = outputPath + "/" + name + "/addon/components"

        phLogger.info("dealComponentClass")

        // fs.writeFileSync(fileDir + "/addon.css", tempData)
        for (let d = 0, len = blueprint.components.length; d < len; d++) {
            const itemComponent = blueprint.components[d]
            // 先读取每一个component 的js 文件，
            // 然后再按照行或者其他方式分隔文件
            // 添加 classNames 的值
            // 保存文件退出
            this.addStyles(fileDir + "/" + itemComponent.name + ".js", itemComponent.styles)
        }
    }

    private async addStyles(path: string, styleData: string[]) {

        const data = fs.readFileSync(path, "utf8").split(/\r\n|\n|\r/gm) // readFileSync的第一个参数是文件名
        const value = "classNames:[" + styleData.join() + "]," + "\r"
        data.splice(1, 0, value)
        fs.writeFileSync(path, data.join("\r\n"))
    }
}
