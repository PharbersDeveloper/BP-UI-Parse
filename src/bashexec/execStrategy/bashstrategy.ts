"use strict"

import phLogger from "../../logger/phLogger"

export abstract class ExecStrategy {
    public static instance(): ExecStrategy {
        phLogger.error("never in here")
        return null
    }
    public exec(cmd: string) {
        phLogger.error("never in here")
    }
}
