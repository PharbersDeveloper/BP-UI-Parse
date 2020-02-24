"use strict"

import * as fs from "fs"
import path from "path"
import configResult from "../application/configResult"
import { BashExec } from "../bashexec/bashexec"
import phLogger from "../logger/phLogger"
import { copyFileData } from "./copy"

export class AddChartTools extends BashExec {
    protected cmd = "ember"
    private isAddon: boolean = true
    private output: string = null
    private pName: string = null
    constructor(output: string, pName: string) {
        super()
        this.isAddon = configResult.getIsAddon()
        this.output = output
        this.pName = pName
    }
    public async exec(callback: (code: number) => void) {
        const { output, pName } = this
        const srcDir = path.join(process.argv[1], "src", "utils", "charts")
        const tarDir = path.resolve(output, pName, "addon/utils")

        // 判断目标文件夹路径是否存在，如果未存在则创建。
        // 并进行递归复制文件
        copyFileData(srcDir, tarDir, (err) => {
            if (err) {
                phLogger.info(err)
            }
        })

        if (callback) {
            callback(0)
        }
    }

    // private copyFileData() {
    //     const { output, pName } = this
    //     let toolsFileName: string = "tooltips.js"
    //     let toolsDepsFileName: string = "numberFormatter.js"
    //     let filePath: string = path.join(process.argv[1], "src", "utils")
    //     const toolsSrc = path.resolve(filePath, toolsFileName)
    //     const toolsDep = path.resolve(filePath, toolsDepsFileName)
    //     const targetPath: string = path.resolve(output, pName, "addon/utils")
    //     const toolsDepData = fs.readFileSync(toolsDep)
    //     const toolsData = fs.readFileSync(toolsSrc)

    //     fs.writeFileSync(path.resolve(targetPath, toolsDepsFileName), toolsDepData)
    //     fs.writeFileSync(path.resolve(targetPath, toolsFileName), toolsData)

    // }
}
