"use strict"

import fs from "fs"
import { JsonConvert } from "json2typescript"
import BPCtx from "../context/BPCtx"
import BPEmberCtx from "../context/BPEmberCtx"
import { ParseBPML } from "../factory/ParseBPML"
import phLogger from "../logger/phLogger"
import { BPObject } from "../object/BPObject"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"
import { BPWidget } from "../widgets/BPWidget"
import BPComp from "../widgets/Comp"
import BPMainWindow from "../widgets/windows/BPMainWindow"

export default class BPApplication extends BPObject {

    public ctxs: BPCtx[] = []
    public routers: BPMainWindow[] = []

    public run(args: string[]) {
        const projectPath = process.env.PH_TS_SERVER_HOME + "/test/data/buttons" // TODO: 解析工作
        // const projectPath = "/Users/alfredyang/Desktop/code/pharbers/BP-UI-Parse/test/data/buttons" // TODO: 解析工作
        const inputPath = projectPath + "/main.bpml"
        const jsonConvert: JsonConvert = new JsonConvert()
        const inputFileData = fs.readFileSync(inputPath, "utf8")
        const appContent = jsonConvert.deserializeObject(JSON.parse(inputFileData), ParseBPML)
        if (this.exec(appContent)) {
            // 整体内容整理完毕：
            // this.routers 包含全部的展示页面（以及组件）
            // phLogger.info(this.routers)

            this.ctxs.forEach( (ctx) => {
                this.routers.forEach( (x) => x.paint(ctx) )
            } )
        }
    }

    public exec(content: ParseBPML): boolean {

        content.meta.ctxs.forEach( (ctx) => {
            phLogger.info("alfred test paint context")
            phLogger.info(ctx)
            if (ctx === "ember") {
                this.ctxs.push(new BPEmberCtx(content.meta.name))
            }
        })

        content.routers.forEach((router) => {
            const mw = new BPMainWindow()
            mw.resetObjId(router.id)
            const cp = new BPThemeProperty()
            router.css.forEach( (c) => cp.resetProperty(c.k, c.v) )
            mw.css = cp.properties
            // 将 components 放入 mw
            const components: BPComp[] = []
            router.components.forEach( (comp) => {
                const singleComp = new BPComp()
                const icp = new BPThemeProperty()
                comp.css.forEach( (c) => icp.resetProperty(c.k, c.v) )
                singleComp.css = icp.properties
                singleComp.type = comp.type
                singleComp.name = comp.name

                components.push(singleComp)
            })
            mw.components = components
            mw.routeName = router.name
            // end 将 components 放入 mw
            this.routers.push(mw)
        } )
        return true
    }
}
