"use strict"

import { EmberAddonExec } from "../bashexec/addonExec"
import { BashSpwanCmds } from "../bashexec/bashcmdlst"
import { CdExec } from "../bashexec/cdExec"
import { EmberGenExec } from "../bashexec/emberGenExec"
import { EmberYarnExec } from "../bashexec/emberYarn"
import { RemoveFolderExec } from "../bashexec/removeFolderExec"
import phLogger from "../logger/phLogger"
import BPMainWindow from "../widgets/windows/BPMainWindow"
import BPCtx from "./BPCtx"

export default class BPEmberCtx extends BPCtx {
    public type: string = "ember"
    private cmdlst = new BashSpwanCmds()
    constructor(name: string) {
        super()
        phLogger.info("exec something with emberjs")
        this.name = name
        const output: string = "/Users/frank/Documents/work/pharbers/nocode-output"

        this.cmdlst.cmds = [
            new CdExec(output),
            new RemoveFolderExec(name),
            new EmberAddonExec(name),
            new CdExec(output + "/" + name),
            new EmberYarnExec("install"),
            // new EmberGenExec("route", "test-route", "--dummy"),
            //  new EmberInitBlueprintExec(inputPath, output, name, componentData.components),
            //  new EmberBlueprintExec(componentData),
            //  new GenerateStyle(cssData, output, name),
            //  new EmberYarnExec("remove", "ember-cli-htmlbars"),
            //  new EmberInstallDepExec("ember-cli-htmlbars", "-S"),
            //  new CdExec(output + "/" + name),
            //  new EmberShowExec(output, name, componentData.components)
        ]
    }
    public paintMW(routeName: string): void {
        this.cmdlst.cmds.push(new EmberGenExec("route", routeName, "--dummy"))
        phLogger.info(this.cmdlst.cmds)
        this.runExec()

    }
    private runExec() {
        this.cmdlst.exec()
    }

}
