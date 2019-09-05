"use strict"

import { spawn } from "child_process"
import { StringDecoder } from "string_decoder"
import phLogger from "../../logger/phLogger"
import { ExecStrategy } from "./bashstrategy"

export class SpawnStrategy extends ExecStrategy {
    public exec(cmd: string, args: string[], callback: (code: number) => void) {

        const ex = spawn(cmd, args)

        // 捕获标准输出并将其打印到控制台
        ex.stdout.on("data", (data: string) => {
            const decoder = new StringDecoder("utf8")
            const cent = Buffer.from(data)
            phLogger.info(decoder.write(cent))
        })

        // 捕获标准错误输出并将其打印到控制台
        ex.stderr.on("data", (data: string) => {
            phLogger.error("error:\n" + data)
        })

        // 注册子进程关闭事件
        ex.on("exit", (code: number, signal: any) => {
            phLogger.info("exit:" + code)
            callback(code)
        })
    }
}
