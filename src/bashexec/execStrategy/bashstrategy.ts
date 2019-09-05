"use strict"

import phLogger from "../../logger/phLogger"

export abstract class ExecStrategy {
    public exec(cmd: string, args: string[]) {
        phLogger.error("never in here")
    }
}
