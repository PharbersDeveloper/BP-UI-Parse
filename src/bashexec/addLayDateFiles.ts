"use strict"

import * as fs from "fs"

import * as path from "path"
import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

export class AddLayDateFiles extends BashExec {
    protected cmd = "ember"

    constructor(output: string, pName: string) {
        super()
        this.args = [output, pName]
    }
    public async exec(callback: (code: number) => void) {
        const args = this.args
        const srcDir = path.join(process.argv[1], "test", "data", "pharbersDatePicker")
        const tarDir = args[0] + "/" + args[1] + "/vendor/laydate"
        this.copyDir(srcDir, tarDir, (err) => {if (err) {
            phLogger.info(err)
          }})

        // ember cli build 文件中引入laydate
        this.emberBuildImport()

        if (callback) {
            callback(0)
        }
    }

    private emberBuildImport() {
        const args = this.args
        const src = args[0] + "/" + args[1] + "/ember-cli-build.js"
        const content = `'use strict';
            const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

            module.exports = function(defaults) {
            let app = new EmberAddon(defaults, {
                // Add options here
            });
            // layui-laydate
                app.import("vendor/laydate/theme/default/font/iconfont.eot", {
                    destDir: '/assets/laydate/fonts'
                })
                app.import("vendor/laydate/theme/default/font/iconfont.svg", {
                    destDir: '/assets/laydate/fonts'
                })
                app.import("vendor/laydate/theme/default/font/iconfont.ttf", {
                    destDir: '/assets/laydate/fonts'
                })
                app.import("vendor/laydate/theme/default/font/iconfont.woff", {
                    destDir: '/assets/laydate/fonts'
                })
                app.import("vendor/laydate/theme/default/laydate.css")
            app.import("vendor/laydate/laydate.js")
            app.import('node_modules/echarts/map/js/china.js');
            app.import('node_modules/echarts/map/js/province/zhejiang.js');
            return app.toTree();
            };`
        fs.writeFileSync(src, content)
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
