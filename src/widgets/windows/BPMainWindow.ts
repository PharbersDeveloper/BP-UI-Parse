"use strict"

import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"

export default class BPMainWindow extends BPWidget {

    protected paint() {
        phLogger.info("alfred paint test")
    }

    protected hitSize() {
        phLogger.info("alfred paint test")
    }
}
