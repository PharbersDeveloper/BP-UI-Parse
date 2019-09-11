"use strict"

import * as fs from "fs"
import { BasicComponent} from "../components/BasicCpmponent"
import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

export class EmberInitBlueprintExec extends BashExec {
    // protected cmd = "cd"
    private outputPath: string = ""
    private blueprintData: BasicComponent = null
    // constructor(inputPath: string, outputPath: string, name: string, blueprint: string, testBluep: string) {
    constructor(inputPath: string, outputPath: string, name: string, blueprintClass: BasicComponent) {
        super()
        this.args = [inputPath, outputPath, name]
        this.outputPath = outputPath
        this.blueprintData = blueprintClass
    }
    public async exec(callback: (code: number) => void) {
        this.genBlueprint(this.args[0], this.args[1], this.args[2])
        if (callback) {
            callback(0)
        }
    }
    // 初始化 blueprint 下的 index.js
    private async genBlueprint(inputPath: string, outputPath: string, name: string) {
        const tempPath = inputPath.split("/").slice(0, -1).join("/") + "/"
        const path = tempPath + "tempBlueprint.js"
        const fileData = fs.readFileSync(path, "utf-8")
        const blueprint: string = this.blueprintData.blueprintName
        phLogger.info("some code: " + fs.readFileSync(tempPath + "__name__.js", "utf-8"))

        const fileDir: string = outputPath + "/" + name + "/blueprints/" + blueprint

        // 修改 blueprint‘s index.js （应该是通过一个 blueprint 类，根据inputpath 下的json生成相应的文件信息）
        fs.writeFileSync(fileDir + "/index.js", fileData)

        this.createBlueprint(fileDir)
    }
    private createBlueprint(fileDir: string): void {
        // 创建 blueprint 的 路径
        this.createBlueprintLogicPath(fileDir)
        this.createBlueprintTempPath(fileDir)
    }
    // 创建 blueprint 下的逻辑文件所在的路径
    private async createBlueprintLogicPath(fileDir: string) {
        const path: string = fileDir + "/files/__root__/__path__"
        fs.mkdirSync(path, { recursive: true })
        this.createBlueprintLogicFile(path)
    }
    // 创建 blueprint 下的模版文件所在的路径
    private async createBlueprintTempPath(fileDir: string) {
        const path: string = fileDir + "/files/__root__/__templatepath__"

        fs.mkdirSync(path, { recursive: true })
        this.createBlueprintTempFile(path)

    }
    // 创建 blueprint 下的逻辑文件
    private async createBlueprintLogicFile(path: string) {
        const tempData: string = "import Component from '@ember/component';" +
            "import layout from '../templates/components/<%= dasherizedModuleName %>';" +
            "export default Component.extend({" +
            "    layout," +
            "    tagName: '<%= tagName %>'" +
            "}); "

        this.writeFileSync(path + "/__name__.js", tempData)
    }
    // 创建 blueprint 下的模版文件
    private async createBlueprintTempFile(path: string) {
        const tempData: string = "<h2>" + this.blueprintData.description + " </h2>{{yiled}}"
        this.writeFileSync(path + "/__templatename__.hbs", tempData)
        this.createBlueprintExportFile()
    }
    private writeFileSync(path: string, fileData: string) {
        fs.writeFileSync(path, fileData)
    }
    private async createBlueprintExportFile() {
        const name = this.blueprintData.name
        const path = this.outputPath + "/" + this.args[2] + "/" + "app/components/" + name + ".js"

        fs.writeFileSync(path, "export { default } from " + "'" + this.args[2] + "/components/" + name + "';")
    }
}
