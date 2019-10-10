"use strict"

import fs from "fs"
import { JsonConvert } from "json2typescript"
import { ParseBPML } from "../factory/ParseBPML"
import phLogger from "../logger/phLogger"
import { BPObject } from "../object/BPObject"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"
import { BPWidget } from "../widgets/BPWidget"
import BPMainWindow from "../widgets/windows/BPMainWindow"
import BPCtx from "../context/BPCtx"
import BPEmberCtx from "../context/BPEmberCtx"

export default class BPApplication extends BPObject {

    public ctxs: BPCtx[] = []
    public routers: BPMainWindow[] = []

    public run(args: string[]) {
        const projectPath = "/Users/alfredyang/Desktop/buttons" // TODO: 解析工作
        const inputPath = projectPath + "/main.bpml"
        const jsonConvert: JsonConvert = new JsonConvert()
        const inputFileData = fs.readFileSync(inputPath, "utf8")
        const appContent = jsonConvert.deserializeObject(JSON.parse(inputFileData), ParseBPML)
        if (this.exec(appContent)) {
            this.ctxs.forEach( ctx => {
                this.routers.forEach( (x) => x.paint(ctx) )
            } )
        }
    }

    public exec(content: ParseBPML): boolean {

        content.meta.ctxs.forEach( (ctx) => {
            phLogger.info("alfred test paint context")
            phLogger.info(ctx)
            if (ctx === "ember") {
                this.ctxs.push(new BPEmberCtx())
            }
        })

        content.routers.forEach((router) => {
            const mw = new BPMainWindow()
            mw.resetObjId(router.id)
            const cp = new BPThemeProperty()
            router.css.forEach( (c) => cp.resetProperty(c.k, c.v) )
            this.routers.push(mw)
        } )
        return true
    }
}
