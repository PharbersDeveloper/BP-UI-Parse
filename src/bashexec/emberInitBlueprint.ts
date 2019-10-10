"use strict"

import * as fs from "fs"
import { BasicComponent } from "../components/BasicComponent"
import { uniqBy } from "../utils/uniqby"
import { BashExec } from "./bashexec"

export class EmberInitBlueprintExec extends BashExec {
    // protected cmd = "cd"
    private outputPath: string = ""
    private blueprintData: BasicComponent[] = null
    // constructor(inputPath: string, outputPath: string, name: string, blueprint: string, testBluep: string) {
    constructor(inputPath: string, outputPath: string, name: string, blueprintClass: BasicComponent[]) {
        super()
        this.args = [inputPath, outputPath, name]
        this.outputPath = outputPath
        this.blueprintData = blueprintClass
    }
    public async exec(callback: (code: number) => void) {
        const blueprintData = this.blueprintData
        const uniqBpData = uniqBy(blueprintData, "blueprintName")
        for (let i = 0, len = uniqBpData.length; i < len; i++) {
            this.genBlueprint(this.args[0], this.args[1], this.args[2], uniqBpData[i])
        }
        if (callback) {
            callback(0)
        }
    }
    // 初始化 blueprint 下的 index.js
    private async genBlueprint(inputPath: string, outputPath: string, name: string, blueprintData: BasicComponent) {
        const tempPath = inputPath.split("/").slice(0, -1).join("/") + "/"
        const inputDataPath = tempPath + "tempBlueprint.js"
        const fileData = fs.readFileSync(inputDataPath, "utf-8")
        const blueprint: string = blueprintData.blueprintName

        const fileDir: string = outputPath + "/" + name + "/blueprints/" + blueprint

        fs.mkdirSync(fileDir, { recursive: true })
        // 修改 blueprint‘s index.js （应该是通过一个 blueprint 类，根据inputpath 下的json生成相应的文件信息）
        fs.writeFileSync(fileDir + "/index.js", fileData)

        this.createBlueprint(fileDir, blueprintData)
    }
    private createBlueprint(fileDir: string, blueprintData: BasicComponent): void {
        // 创建 blueprint 的 路径
        this.createBlueprintLogicPath(fileDir, blueprintData)
        this.createBlueprintTempPath(fileDir)
        this.createBlueprintExportPath(fileDir)
    }
    // 创建 blueprint 下的逻辑文件所在的路径
    private async createBlueprintLogicPath(fileDir: string, blueprintData: BasicComponent) {
        const path: string = fileDir + "/files/__root__/__path__"
        fs.mkdirSync(path, { recursive: true })
        this.createBlueprintLogicFile(path, blueprintData)
    }
    // 创建 blueprint 下的模版文件所在的路径
    private async createBlueprintTempPath(fileDir: string) {
        const path: string = fileDir + "/files/__root__/__templatepath__"

        fs.mkdirSync(path, { recursive: true })
        this.createBlueprintTempFile(path)

    }
    // 创建 blueprint 下的逻辑文件
    private async createBlueprintLogicFile(path: string, blueprintData: BasicComponent) {
        // const tempData: string = "import Component from '@ember/component';" + "\r" +
        //     "import layout from '../templates/components/<%= dasherizedModuleName %>';" + "\r" +
        //     "export default Component.extend({" + "\r" +
        //     "    layout," + "\r" +
        //     "    tagName: '" + this.blueprintData[0].tagName + "'" + "\r" +
        //     "}); " + "\r"

        const dataStart: string = "import Component from '@ember/component';" + "\r" +
            "import layout from '../templates/components/<%= dasherizedModuleName %>';" + "\r" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r"
        const dataEnd: string = "}); " + "\r"
        const dataBody: string = "    tagName: '" + blueprintData.tagName + "'," + "\r" +
                "   classNames:<%= addClassNames %>, " + "\r"

        this.writeFileSync(path + "/__name__.js", dataStart + dataBody + dataEnd)
    }
    // 创建 blueprint 下的模版文件
    private async createBlueprintTempFile(path: string) {
        const tempData: string = "{{yield}}"
        this.writeFileSync(path + "/__templatename__.hbs", tempData)
    }
    private writeFileSync(path: string, fileData: string) {
        fs.writeFileSync(path, fileData)
    }
    private async createBlueprintExportPath(fileDir: string) {
        const path: string = fileDir + "/files/__addonroot__"
        fs.mkdirSync(path, { recursive: true })
        this.createBlueprintExportFile(path)
    }
    private async createBlueprintExportFile(path: string) {
        const fileData: string = "export { default } from '<%= modulePath %>';"
        fs.writeFileSync(path + "/__name__.js", fileData)

        // this.createStyles()
    }
    // 创建 styles 文件夹路径 并初始化 addon.css(todo也需要在 ember project 写入样式文件，目前仅限addon)
    // private async createStyles() {
    //     // this.args = [inputPath, outputPath, name]
    //     const fileDir: string = this.args[1] + "/" + this.args[2] + "/addon/styles"
    //     const tempData: string = "*,::after,::before {" + "\r" +
    //         "-webkit-box-sizing: border-box;" + "\r" +
    //         "box-sizing: border-box;" + "\r" +
    //         "font-family: system, -apple-system, BlinkMacSystemFont," + "\r" +
    //         "    'PingFang SC', 'Hiragino Sans GB', 'Segoe UI', 'Roboto', 'Microsoft YaHei'," + "\r" +
    //         "    'Helvetica Neue', Helvetica, Arial, sans-serif;" + "\r" +
    //         "}" + "\r"

    //     fs.mkdirSync(fileDir, { recursive: true })

    //     this.writeFileSync(fileDir + "/addon.css", tempData)
    //     const blueprintData = this.blueprintData
    //     for (let d = 0, len = blueprintData.length; d < len; d++) {
    //         this.addStyles(fileDir + "/addon.css", blueprintData[d])
    //     }
    // }

    // private async addStyles(path: string, componentConfig: BasicComponent) {
    //     // add style
    //     const styles = componentConfig.styles
    //     const styleStart: string = "." + componentConfig.classNames[0] + "{" + "\r"
    //     const styleEnd: string = "}" + "\r"

    //     let styleBody = ""
    //     for (let i = 0, len = styles.length; i < len; i++) {
    //         styleBody += styles[i].toCssLine() + "\r"
    //     }
    //     fs.appendFileSync(path, styleStart + styleBody + styleEnd)
    // }
}