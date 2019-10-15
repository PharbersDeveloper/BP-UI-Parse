"use strict"

import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class BPMainWindow extends BPWidget {

    public components: BPComp[] = []
    private projectName: string = ""
    private routeName: string = ""
    public paint(ctx: BPCtx) {
        phLogger.info("alfred paint test")
        phLogger.info(ctx)

        this.projectName = ctx.name
        ctx.paintMW(this.routeName)

    }
    public setRouteName(name: string) {
        if (name) {
            this.routeName = name
        }
    }
    public getRouteName() {
        return this.routeName
    }

}
