"use strict"

import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"

export default class BPMainWindow extends BPWidget {

    public paint() {
        phLogger.info("alfred paint test")
    }

    public hitSize() {
        phLogger.info("alfred paint test")
    }
}
