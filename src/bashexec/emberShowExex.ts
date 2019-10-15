"use strict"

import * as fs from "fs"
import phLogger from "../logger/phLogger"
import BPComp from "../widgets/Comp"
import { BashExec } from "./bashexec"

export class EmberShowExec extends BashExec {
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
    // 根据bppushbutton 之类的类，修改 components 的属性
    private async changeCompProperties(output: string, name: string, ) {
        const outputPath = output + "/" + name + "/addon/components/" + this.component.name + ".js"
        const fileData = "import Component from '@ember/component';" + "\r" +
        "import layout from '../templates/components/bp-push-button-primary';" + "\r" +
         "\n" +
        "export default Component.extend({" + "\r" +
          "   layout," + "\r" +
          "   tagName:'button'," + "\r" +
          "   classNames:['" + this.component.name + "']," + "\r" +
        "});" + "\r"
        fs.writeFileSync(outputPath, fileData)

    }
    // 生成 css 类
    private async addCompStyles(output: string, name: string, ) {

        const outputPath = output + "/" + name + "/addon/styles"

        let fileData = "." + this.component.name + "{" + "\r" + "\n"
        let styles: string = ""
        this.component.css.forEach((item) => {
            const style = item.key + ": " + item.value + ";" + "\r"
            styles = styles + style
        })

        fileData = fileData + styles + "\r" + "}" + "\r"
        fs.mkdirSync(outputPath, { recursive: true })
        fs.appendFileSync(outputPath + "/addon.css", fileData)

    }
    // 展示 components
    private async showComponents(output: string, name: string, routeName: string) {
        const component = this.component
        const outputPath = output + "/" + name + "/tests/dummy/app/templates/" + routeName + ".hbs"

        // fs.writeFileSync(outputPath, this.recursiveComponents(component))
        fs.appendFileSync(outputPath, this.recursiveComponents(component))
    }

    private recursiveComponents(component: BPComp) {
        let fileData: string = ""

        fileData = "{{#" + component.name + "}}" + component.type + "{{/" + component.name + "}}"

        return fileData + "\r"
    }
}
