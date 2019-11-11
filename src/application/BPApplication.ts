"use strict"

import fs from "fs"
import { JsonConvert } from "json2typescript"
import { BashSpwanCmds } from "../bashexec/bashcmdlst"
import BPCtx from "../context/BPCtx"
import BPEmberCtx from "../context/BPEmberCtx"
import { ParseBPML } from "../factory/ParseBPML"
import { ParseCompConf } from "../factory/ParseCompConf"
import phLogger from "../logger/phLogger"
import { BPObject } from "../object/BPObject"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"
import { BPWidget } from "../widgets/BPWidget"
import BPComp from "../widgets/Comp"
import BPMainWindow from "../widgets/windows/BPMainWindow"

export default class BPApplication extends BPObject {
    public ctxs: BPCtx[] = []
    public routers: BPMainWindow[] = []
    private cmdlst = new BashSpwanCmds()

    public run(args: string[]) {
        // const projectPath = args[1] + "/test/data/buttons" // TODO: 解析工作
        const projectPath = args[1] + "/test/data/charts" // TODO: 解析工作
        const inputPath = projectPath + "/charts.json"
        const jsonConvert: JsonConvert = new JsonConvert()
        const inputFileData = fs.readFileSync(inputPath, "utf8")
        const appContent = jsonConvert.deserializeObject(JSON.parse(inputFileData), ParseBPML)

        if (this.exec(appContent)) {
            // 整体内容整理完毕：
            // this.routers 包含全部的展示页面（以及组件）
            this.cmdlst.cmds = []
            const that = this
            this.ctxs.forEach((ctx) => {
                this.routers.forEach((x) => {
                    that.cmdlst.cmds = [...x.paint(ctx)]
                })
            })
            this.cmdlst.exec()
        }
    }

    public exec(content: ParseBPML): boolean {

        content.meta.ctxs.forEach((ctx) => {
            phLogger.info("alfred test paint context")
            // phLogger.info(ctx)
            if (ctx === "ember") {
                this.ctxs.push(new BPEmberCtx(content.meta.name))
            }
        })

        content.routers.forEach((router) => {
            const mw = new BPMainWindow()
            mw.resetObjId(router.id)
            const cp = new BPThemeProperty()
            router.css.forEach((c) => cp.resetProperty(c.k, c.v, c.tp, c.pe))
            router.layout.forEach((c) => cp.resetProperty(c.k, c.v, c.tp, c.pe))

            mw.css.push(...cp.properties)
            // 将 components 放入 mw
            mw.components = this.deepParseComp(router.components)

            mw.routeName = router.name
            // end 将 components 放入 mw
            // phLogger.info(mw.components[1].components[1])
            this.routers.push(mw)
        })
        return true
    }
    private deepParseComp(comps: ParseCompConf[]) {
        const components: BPComp[] = []
        // 对组件 css 的处理
        comps.forEach((comp) => {
            const singleComp = new BPComp()
            const icp = new BPThemeProperty()
            const compCss = comp.css || []
            compCss.forEach((c) => icp.resetProperty(c.k, c.v, c.tp, c.pe))
            Object.assign(singleComp, comp)
            singleComp.css = compCss.length > 0 ? icp.properties : []
            // singleComp.type = comp.type
            // singleComp.name = comp.name
            // singleComp.text = comp.text || ""
            // singleComp.attrs = comp.attrs
            // singleComp.cat = comp.cat || "1"
            singleComp.components = this.deepParseComp(comp.components)

            components.push(singleComp)
        })
        return components
    }
}
