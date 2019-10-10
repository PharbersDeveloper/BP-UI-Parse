"use strict"

import * as fs from "fs"
import { BasicComponent } from "../components/BasicComponent"
import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

export class EmberShowExec extends BashExec {
    protected cmd = "ember"
    protected components: BasicComponent[] = []
    constructor( output: string, name: string, components: BasicComponent[]) {
        super()
        this.components = components
        this.args = [output, name]
    }
    public async exec(callback: (code: number) => void) {
        this.showComponents(this.args[0], this.args[1])
        if (callback) {
            callback(0)
        }
    }
    // 展示 components
    private async showComponents(output: string, name: string) {
        const componentsData = this.components
        const outputPath = output + "/" + name + "/tests/dummy/app/templates/application.hbs"
        // let fileData = fs.readFileSync(outputPath, "utf-8")
        // let fileData: string = ""

        // fileData = this.recursiveComponents(componentsData)
        phLogger.info(this.recursiveComponents(componentsData))

        fs.writeFileSync(outputPath, this.recursiveComponents(componentsData))
    }

    private recursiveComponents(componentsData: BasicComponent[]) {

        let fileData: string = ""

        for (let i = 0, len = componentsData.length; i < len; i++) {
            const componentData = componentsData[i]
            let showData = ""
            const componentsLength = componentData.components.length

            if (componentsLength === 0) {
                showData = this.showIcon(componentData)
                // showData = "{{#" + componentData.name + "}}" + componentData.description
                // + "{{/" + componentData.name + "}}" + "\r"
            } else {
                showData = "{{#" + componentData.name + "}}"
                const inside: string = this.recursiveComponents(componentData.components)

                showData = showData + inside + "{{/" + componentData.name + "}}"
            }

            fileData = fileData + showData + "\r"
        }
        return fileData
    }
    private showIcon(cData: BasicComponent) {
        // <FaIcon @icon="ad"/>
        if (cData.name === "fa-icon") {
            return `<FaIcon @icon="${cData.description}" />`
        }
        return "{{#" + cData.name + "}}" + cData.description + "{{/" + cData.name + "}}" + "\r"
    }
}
