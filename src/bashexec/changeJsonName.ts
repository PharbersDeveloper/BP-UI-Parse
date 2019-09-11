"use strict"

import * as fs from "fs"
import { BashExec } from "./bashexec"

export class ChangeJsonName extends BashExec {
    protected cmd = "cd"
    private packjsonData: any
    constructor(path: string, name: string) {
        super()
        this.getPackageJson(path, name)
        this.writePackageJson(path, name)
        this.args = [path + "/" + name]
    }
    private getPackageJson(path: string, name: string) {
        const packageJson = fs.readFileSync(path + "/" + name + "/package.json")
        this.packjsonData = JSON.parse(packageJson.toString())
        return JSON.parse(packageJson.toString())
    }
    private writePackageJson(path: string, newName: string) {
        const cbDataPackage = this.packjsonData
        cbDataPackage.name = newName
        fs.writeFile(path + "/" + newName + "/package.json", JSON.stringify(cbDataPackage), (err) => err)
    }
}
