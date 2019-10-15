"use strict"

import { EmberAddonExec } from "../bashexec/addonExec"
import { BashSpwanCmds } from "../bashexec/bashcmdlst"
import { CdExec } from "../bashexec/cdExec"
import { EmberGenExec } from "../bashexec/emberGenExec"
import { EmberInstallDepExec } from "../bashexec/emberInstallDepExec"
import { EmberYarnExec } from "../bashexec/emberYarn"
import { RemoveFolderExec } from "../bashexec/removeFolderExec"
import phLogger from "../logger/phLogger"
import {BPWidget} from "../widgets/BPWidget"
import BPPushButton from "../widgets/buttons/BPPushButton"
import BPComp from "../widgets/Comp"
import BPMainWindow from "../widgets/windows/BPMainWindow"
import BPCtx from "./BPCtx"

export default class BPEmberCtx extends BPCtx {
    public type: string = "ember"
    private cmdlst = new BashSpwanCmds()
    private compTypeList: any[] = []
    private currentCompTypeList: any[] = []
    private output: string = ""

    constructor(name: string) {
        super()
        phLogger.info("exec something with emberjs")
        this.name = name
        const output: string = "/Users/frank/Documents/work/pharbers/nocode-output"
        this.output = output
        this.cmdlst.cmds = [
            new CdExec(output),
            new RemoveFolderExec(name),
            new EmberAddonExec(name),
            new CdExec(output + "/" + name),
            new EmberYarnExec("install")
        ]
    }
    public paintMW(routeName: string, components: BPComp[]): void {
        this.genCompTypeList(routeName)
        // 生成路由
        this.cmdlst.cmds.push(new EmberGenExec("route", routeName, "--dummy"))
        // 生成当前路由下的 component
        this.paintComps(this, components)
        // 保证ember addon 可以使用 ember s运行
        this.runEmberAddon()
        // 重写文件，将上面的组件进行展示
        this.showComp(components)
        // 执行
        this.runExec()
    }
    public paintComps(ctx: BPCtx, components: BPComp[]) {
        const compTypeList = this.compTypeList
        for (let i = 0, len = components.length; i < len; i++) {
            const component = components[i]

            this.cmdlst.cmds.push(new EmberGenExec("component", component.name))

            compTypeList.forEach((item) => {
                if (item.constructor.name === component.type) {
                    this.currentCompTypeList.push(item)
                }
            })
        }
    }
    private genCompTypeList(routeName: string) {
        // TODO 生成目前所有组件类的全集
        this.compTypeList.push(new BPPushButton(this.output, this.name, routeName))
        return this.compTypeList
    }
    private runEmberAddon() {
        // 在组件中展示需要把ember-cli-htmlbars 插件放入 dependencies 内
        const showExec = [
            new EmberYarnExec("remove", "ember-cli-htmlbars"),
            new EmberInstallDepExec("ember-cli-htmlbars@3.0.0", "-S"),
        ]
        this.cmdlst.cmds.push(...showExec)
    }
    private showComp(components: BPComp[]) {
        const currentCompTypeList = this.currentCompTypeList
        const that = this

        currentCompTypeList.forEach((item, index) => {
            that.cmdlst.cmds.push(...(item.paint(that, components[index])))
        })
    }
    private runExec() {
        this.cmdlst.exec()
    }

}
