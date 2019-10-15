"use strict"

import phLogger from "../logger/phLogger"

export default class BPCtx {
    public type: string = ""
    public name: string = ""
    public paintMW(name: string) {
        phLogger.info("paint mainwindows")
    }
}
