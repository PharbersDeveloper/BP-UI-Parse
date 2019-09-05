"use strict"

import phLogger from "../../logger/phLogger"

export abstract class ExecStrategy {
    public exec(cmd: string, args: string[], callback: (code: number) => void) {
        phLogger.error("never in here")
    }
}
