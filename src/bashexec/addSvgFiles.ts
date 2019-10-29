"use strict"

import * as fs from "fs"

import * as path from "path"
import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

export class AddSvgFiles extends BashExec {
    protected cmd = "ember"

    constructor(output: string, pName: string) {
        super()
        this.args = [output, pName]
    }
    public async exec(callback: (code: number) => void) {
        const args = this.args
        const srcDir = path.join(process.argv[1], "test", "data", "icons")
        const tarDir = args[0] + "/" + args[1] + "/tests/dummy/public"
        this.copyDir(srcDir, tarDir, (err) => {if (err) {
            phLogger.info(err)
          }})

        if (callback) {
            callback(0)
        }
    }
    private copyDir(src: string, dist: string, callback: (err: any) => void) {
        fs.access(dist, (err) => {
            if (err) {
                // 目录不存在时创建目录
                fs.mkdirSync(dist)
            }
            this._copy(null, src, dist, callback)
        })

    }
    private _copy(err: any, src: string, dist: string, cb: (err: any) => void) {
        if (err) {
            cb(err)
        } else {
            fs.readdir(src, (errRead, files) => {
                if (errRead) {
                    cb(errRead)
                } else {
                    files.forEach((file) => {
                        const srcPath = path.join(src, file)
                        const distPath = path.join(dist, file)
                        fs.stat(srcPath, (errStat, stat) => {
                            if (errStat) {
                                cb(errStat)
                            } else {
                                // 判断是文件还是目录
                                if (stat.isFile()) {
                                    fs.writeFileSync(distPath, fs.readFileSync(srcPath))
                                } else if (stat.isDirectory()) {
                                    // 当是目录是，递归复制
                                    this.copyDir(srcPath, distPath, cb)
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}
