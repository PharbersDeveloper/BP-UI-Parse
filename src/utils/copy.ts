import * as fs from "fs"
import path from "path"
import phLogger from "../logger/phLogger"

function pathExist(targetPath: string, callback: (err: any) => void): void {
    fs.access(targetPath, (err) => {
        if (err) {
            // 目录不存在时创建目录
            fs.mkdirSync(targetPath)
        }
    })
}

async function copyFileData(sourcePath: string, targetPath: string, callback: (err: any) => void) {
    await pathExist(targetPath, (err) => {
        if (err) { phLogger.info(err) }
    })
    copyFileRecursive(null, sourcePath, targetPath, callback)
}

function copyFileRecursive(err: any, src: string, dist: string, cb: (err: any) => void) {
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
                                copyFileData(srcPath, distPath, cb)
                            }
                        }
                    })
                })
            }
        })
    }
}
export { pathExist, copyFileData }
