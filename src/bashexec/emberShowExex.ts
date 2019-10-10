"use strict"

import * as fs from "fs"
import { BasicComponent } from "../components/BasicComponent"
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
        let fileData: string = ""

        for (let i = 0, len = componentsData.length; i < len; i++) {
            const componentData: BasicComponent = componentsData[i]

            const showData = ""

            // showData = "{{#" + componentData.name + "}}" + componentData.description
            // + "{{/" + componentData.name + "}}"

            fileData = fileData + showData + "\r"
        }
        fs.writeFileSync(outputPath, fileData)
    }
}
