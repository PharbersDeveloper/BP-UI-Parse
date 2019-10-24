"use strict"

import BPCtx from "../context/BPCtx"
import { BPLayout } from "../layouts/BPLayout"
import phLogger from "../logger/phLogger"
import { BPObject } from "../object/BPObject"
import { CssProperty } from "../properties/CssPerperty"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"
import BPComp from "./Comp"

export abstract class BPWidget extends BPObject {

    public css: CssProperty[] = []
    public output: string = ""
    public projectName: string = ""
    public routeName: string = ""
    protected mainLayout: BPLayout = null
    private theme: BPThemeProperty = null

    constructor(output?: string, name?: string, routeName?: string) {
        super()
        this.output = output
        this.projectName = name
        this.routeName = routeName
    }
    // 生成 展示用的 hbs 代码
    public paintShow(comp: BPComp, ...rest: any[]) {
        phLogger.info("alfred paintShow test")
    }

    public paintStyle(comp: BPComp, prefix?: string) {

        // 该组件的 css 样式
        const className = "." + comp.name + "{" + "\r" + "\n"
        let fileData = prefix ? "." + prefix + " " + className : className
        let styles: string = ""

        comp.css.filter((item) => item.tp === "css").forEach((item) => {
            const style = item.key + ": " + item.value + ";" + "\r"
            styles = styles + style
        })
        fileData = fileData + styles + "\r" + "}" + "\r"

        // 伪类
        comp.css.filter((item) => item.tp !== "css").forEach((item) => {
            const pseudoClassName =  "." + comp.name + ":" + item.tp + " {" + "\r" + "\n"
            let pseudoClass: string = prefix ? "." + prefix + " " + pseudoClassName : pseudoClassName
            const pseudoStyle = item.key + ": " + item.value + ";" + "\r"
            pseudoClass = pseudoClass + pseudoStyle + "\r" + "}" + "\r"
            fileData += pseudoClass
        })
        let insideCompsStyle = ""
        if (Array.isArray(comp.components) && comp.components.length > 0) {
            comp.components.forEach((icomp) => {
                insideCompsStyle += this.paintStyle(icomp, comp.name)
            })
        }
        return fileData + insideCompsStyle

    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = ""

        return fileDataStart + fileData + fileDataEnd
    }
    public paintLoginStart(comp: BPComp) {
        const fileData = "import Component from '@ember/component';" + "\r" +
            "import layout from '../templates/components/" + comp.name + "';" + "\r"
            // "\n" +
            // "export default Component.extend({" + "\r" +
            // "    layout," + "\r"
        return fileData
    }
    public paintLoginEnd() {
        return "});" + "\r"
    }

    protected paint(ctx: BPCtx, comp?: BPComp) {
        phLogger.info("alfred paint test")
    }

    protected hitSize() {
        phLogger.info("alfred paint test")
    }
}
