"use strict"

import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"
import BPCtx from "../../context/BPCtx"

export default class BPMainWindow extends BPWidget {

    public paint(ctx: BPCtx) {
        phLogger.info("alfred paint test")
    }

    public hitSize() {
        phLogger.info("alfred paint test")
    }
}
