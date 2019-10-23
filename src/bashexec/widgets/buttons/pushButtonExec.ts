"use strict"

import * as fs from "fs"
import phLogger from "../../../logger/phLogger"
import BPComp from "../../../widgets/Comp"
import { BashExec } from "../.././bashexec"

export class PushButtonExec extends BashExec {
    protected cmd = "ember"
    protected component: BPComp = null

    constructor(output: string, name: string, routeName: string,
                component: BPComp, logicData: string, showData: string) {
        super()
        this.component = component
        this.args = [output, name, routeName, logicData, showData]
    }
    public async exec(callback: (code: number) => void) {
        this.changeCompProperties(this.args[0], this.args[1], this.args[3])
        this.addCompStyles(this.args[0], this.args[1])
        this.showComponents(this.args[0], this.args[1], this.args[2], this.args[4])
        if (callback) {
            callback(0)
        }
    }
    // 根据 bppushbutton 之类的类，修改 components 的属性
    private async changeCompProperties(output: string, name: string, logicData: string) {

        const outputPath = output + "/" + name + "/addon/components/" + this.component.name + ".js"

        fs.writeFileSync(outputPath, logicData)

    }
    // 生成 css 类
    private async addCompStyles(output: string, name: string, ) {

        const outputPath = output + "/" + name + "/addon/styles"

        // 该组件的 css 样式
        let fileData = "." + this.component.name + "{" + "\r" + "\n"
        let styles: string = ""

        this.component.css.filter((item) => item.tp === "css").forEach((item) => {
            const style = item.key + ": " + item.value + ";" + "\r"
            styles = styles + style
        })
        fileData = fileData + styles + "\r" + "}" + "\r"

        // 伪类
        this.component.css.filter((item) => item.tp !== "css").forEach((item) => {
            let pseudoClass: string = "." + this.component.name + ":" + item.tp + " {" + "\r" + "\n"
            const pseudoStyle = item.key + ": " + item.value + ";" + "\r"
            pseudoClass = pseudoClass + pseudoStyle + "\r" + "}" + "\r"
            fileData += pseudoClass
        })

        const existFile: boolean = this.fsExistsSync(outputPath)
        if (!existFile) {
            fs.mkdirSync(outputPath, { recursive: true })
        }
        fs.appendFileSync(outputPath + "/addon.css", fileData)

    }
    private  fsExistsSync(path: string) {
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK)
          } catch (err) {
            return false
          }
        return true
    }
    // 展示 components
    private async showComponents(output: string, name: string, routeName: string, showData: string) {
        const component = this.component
        const outputPath = output + "/" + name + "/tests/dummy/app/templates/" + routeName + ".hbs"

        // fs.writeFileSync(outputPath, this.recursiveComponents(component))
        const hbsData = fs.readFileSync(outputPath, "utf8")

        let containerStart: string = ""
        const    containerBody = showData
        const    containerEnd = "</div>"

        if (hbsData === "{{outlet}}") {
            containerStart = "<div class='bp-" + routeName + "'>"
        } else {
            containerStart = hbsData.split("</div>")[0]
        }
        fs.writeFileSync(outputPath, containerStart + containerBody + containerEnd)

        // fs.appendFileSync(outputPath, containerStart + containerBody + containerEnd)
    }
}
