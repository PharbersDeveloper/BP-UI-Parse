"use strict"

import fs from "fs"
import { JsonConvert } from "json2typescript"
import { ParseBPML } from "../factory/ParseBPML"
import phLogger from "../logger/phLogger"
import { BPObject } from "../object/BPObject"
import { BPWidget } from "../widgets/BPWidget"

export default class BPApplication extends BPObject {

    public mainWindow: BPWidget = null

    public run(args: string[]) {
        /**
         * 将index.ts中的东西转移进来
         */
        // program
        //     .version("0.1.0")
        //     .option("-d, --directory <directory>", "the ui generate file path")
        //     .option("-s, --style <style>", "the ui styles file path")
        //     .option("-m, --mode <mode>",
                // "the output type of the result components, ember or react, only ember for now")
        //     .option("-o, --output <output>", "output to local distination dir")
        //     .option("-n, --name <name>", "output name")
        //     .action(this.exec)
        //     .parse(args)

        const projectPath = "~/Users/alfred/Desktop/buttons"
        const inputPath = projectPath + "/main.bpml"
        const jsonConvert: JsonConvert = new JsonConvert()
        const inputFileData = fs.readFileSync(inputPath, "utf8")
        const appContent = jsonConvert.deserializeObject(JSON.parse(inputFileData), ParseBPML)
        phLogger.info(appContent)
    }

    /**
     * 创建解析器，分几步呢
     * 1. 首先，需要将窗口抽象成树型结构
     */
    public async exec(options: any) {
        phLogger.info("alfred test")
    }
}
