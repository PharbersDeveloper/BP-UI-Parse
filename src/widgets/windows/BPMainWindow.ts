"use strict"

import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"

export default class BPMainWindow extends BPWidget {

    public paint(ctx: BPCtx) {
        phLogger.info("alfred paint test")
    }
}
