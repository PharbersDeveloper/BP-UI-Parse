"use strict"

import * as fs from "fs"
import phLogger from "../../../logger/phLogger"
import BPComp from "../../../widgets/Comp"
import { BashExec } from "../.././bashexec"

export class TagExec extends BashExec {
    protected cmd = "ember"
    protected component: BPComp = null
    constructor(output: string, name: string, routeName: string, component: BPComp) {
        super()
        this.component = component
        this.args = [output, name, routeName]
    }
    public async exec(callback: (code: number) => void) {
        this.changeCompProperties(this.args[0], this.args[1])
        this.addCompStyles(this.args[0], this.args[1])
        this.showComponents(this.args[0], this.args[1], this.args[2])
        if (callback) {
            callback(0)
        }
    }
    // 根据 bppushbutton 之类的类，修改 components 的属性
    private async changeCompProperties(output: string, name: string) {

        const infoType = this.component.attrs.infoType
        const infoClass = this.component.attrs.bold === "fasle" ? infoType + "-subtle" : infoType + "-bold"
        const outputPath = output + "/" + name + "/addon/components/" + this.component.name + ".js"
        const fileData = "import Component from '@ember/component';" + "\r" +
        "import layout from '../templates/components/" + this.component.name + "';" + "\r" +
         "\n" +
        "export default Component.extend({" + "\r" +
          "   layout," + "\r" +
          "   tagName:'span'," + "\r" +
          "   classNames:['" + this.component.name + " " + infoType + " " + infoClass + "']," + "\r" +
          "   content: 'default'," + "\r" +
          "classNameBindings: ['type', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
          "attributeBindings: ['disabled']," + "\r" +
        "});" + "\r"
        fs.writeFileSync(outputPath, fileData)

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

        // fileData 包含一下public css
        const publicCSS = fs.readFileSync(process.argv[1] + "/src/public.css", "utf8")
        fileData += publicCSS

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
    private async showComponents(output: string, name: string, routeName: string) {
        const component = this.component
        const outputPath = output + "/" + name + "/tests/dummy/app/templates/" + routeName + ".hbs"

        // fs.writeFileSync(outputPath, this.recursiveComponents(component))
        const hbsData = fs.readFileSync(outputPath, "utf8")

        let containerStart: string = ""
        const    containerBody = this.recursiveComponents(component)
        const    containerEnd = "</div>"

        if (hbsData === "{{outlet}}") {
            containerStart = "<div class='bp-" + routeName + "'>"
        } else {
            containerStart = hbsData.split("</div>")[0]
        }
        fs.writeFileSync(outputPath, containerStart + containerBody + containerEnd)

        // fs.appendFileSync(outputPath, containerStart + containerBody + containerEnd)
    }

    private recursiveComponents(component: BPComp): string {
        let fileData: string = ""
        const content = component.attrs.value

        fileData = "{{#" + component.name + "}}" + content + "{{/" + component.name + "}}"

        return fileData + "\r"
    }
}
