"use strict"

import fs from "fs"
import { JsonConvert } from "json2typescript"
import { ParseBPML } from "../factory/ParseBPML"
import phLogger from "../logger/phLogger"
import { BPObject } from "../object/BPObject"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"
import { BPWidget } from "../widgets/BPWidget"
import BPMainWindow from "../widgets/windows/BPMainWindow"

export default class BPApplication extends BPObject {

    public routers: BPMainWindow[] = []

    public run(args: string[]) {
        /**
         * 将index.ts中的东西转移进来
         */
        const projectPath = "/Users/alfredyang/Desktop/buttons"
        const inputPath = projectPath + "/main.bpml"
        const jsonConvert: JsonConvert = new JsonConvert()
        const inputFileData = fs.readFileSync(inputPath, "utf8")
        const appContent = jsonConvert.deserializeObject(JSON.parse(inputFileData), ParseBPML)
        if (this.exec(appContent)) {
            phLogger.info("alfred test with paint")
        }
    }

    /**
     * 创建解析器，分几步呢
     * 1. 首先，需要将窗口抽象成树型结构
     */
    public exec(content: ParseBPML): boolean {
        phLogger.info(content)
        content.routers.forEach((router) => {
            const mw = new BPMainWindow()
            mw.resetObjId(router.id)
            phLogger.info(mw)
            const cp = new BPThemeProperty()
            router.css.forEach( (c) => cp.resetProperty(c.k, c.v) )
            phLogger.info(cp)
            this.routers.push(mw)
        } )
        return true
    }
}
