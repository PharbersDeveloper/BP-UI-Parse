"use strict"

import { spawn } from "child_process"
import phLogger from "../../logger/phLogger"
import { ExecStrategy } from "./bashstrategy"

export class SpawnStrategy extends ExecStrategy {
    public static instance(): SpawnStrategy {
        return new SpawnStrategy()
    }

    public async exec(cmd: string) {

        const ex = spawn(cmd)

        // 捕获标准输出并将其打印到控制台
        ex.stdout.on("data", (data: string) => {
            phLogger.info("standard output:\n" + data)
        })

        // 捕获标准错误输出并将其打印到控制台
        ex.stderr.on("data", (data: string) => {
            phLogger.error("standard error output:\n" + data)
        })

        // 注册子进程关闭事件
        ex.on("exit", (code: number, signal: any) => {
            phLogger.info("child process eixt ,exit:" + code)
        })
    }
}
