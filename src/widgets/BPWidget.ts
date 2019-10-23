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
    public paintShow(comp: BPComp) {
        phLogger.info("alfred paintShow test")
    }

    protected paint(ctx: BPCtx, comp?: BPComp) {
        phLogger.info("alfred paint test")
    }

    protected hitSize() {
        phLogger.info("alfred paint test")
    }
}
