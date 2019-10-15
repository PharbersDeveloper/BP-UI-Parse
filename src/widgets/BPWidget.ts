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
    protected mainLayout: BPLayout = null
    private theme: BPThemeProperty = null

    protected paint(ctx: BPCtx, compnent?: BPComp) {
        phLogger.info("alfred paint test")
    }

    protected hitSize() {
        phLogger.info("alfred paint test")
    }
}
