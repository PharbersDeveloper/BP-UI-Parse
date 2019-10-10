"use strict"

import BPCtx from "../context/BPCtx"
import { BPLayout } from "../layouts/BPLayout"
import phLogger from "../logger/phLogger"
import { BPObject } from "../object/BPObject"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"

export abstract class BPWidget extends BPObject {
    protected mainLayout: BPLayout = null
    private theme: BPThemeProperty = null

    protected paint(ctx: BPCtx) {
        phLogger.info("alfred paint test")
    }

    protected hitSize() {
        phLogger.info("alfred paint test")
    }
}
