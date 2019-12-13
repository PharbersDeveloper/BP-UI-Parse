"use strict"

import BPCtx from "../context/BPCtx"
import phLogger from "../logger/phLogger"
import {IAttrs} from "../properties/Options"
import { BPWidget } from "./BPWidget"

export default class BPComp extends BPWidget {
    public id: string = ""
    public type: string = ""
    public name: string = ""
    public text?: string = ""
    public cat: string = "1"
    public attrs?: any = {}
    public icon?: string = ""
    public styleAttrs?: IAttrs[] = []
    public events?: string[] = []
    public calcAttrs?: IAttrs[] = []
    public components?: BPComp[] = []
    public paint(ctx: BPCtx) {
        phLogger.info("alfred paint test")
    }
}
