"use strict"

import configResult from "../application/configResult"
import { AddBaseClass } from "../bashexec/addBaseClass"
import { AddLayDateFiles } from "../bashexec/addLayDateFiles"
import { EmberAddonExec } from "../bashexec/addonExec"
import { AddSvgFiles } from "../bashexec/addSvgFiles"
import { CdExec } from "../bashexec/cdExec"
import { EmberGenExec } from "../bashexec/emberGenExec"
import { EmberInstallDepExec } from "../bashexec/emberInstallDepExec"
import { EmberYarnExec } from "../bashexec/emberYarn"
import { GenCompList } from "../bashexec/genCompList"
import { GenMWStylesExec } from "../bashexec/genMWStylesExec"
import { RemoveFolderExec } from "../bashexec/removeFolderExec"
import { SassyStyles } from "../bashexec/sassyStyles"
import BPBelongTo from "../helper/BPBelongTo"
import BPEq from "../helper/bpEq"
import BPSomeBelongTo from "../helper/BPSomeBelongTo"
import phLogger from "../logger/phLogger"
import { AddChartTools } from "../utils/AddChartTools"
import BPComp from "../widgets/Comp"
import BPSlot from "../widgets/slotleaf/BPSlot"
import BPMainWindow from "../widgets/windows/BPMainWindow"
import BPCtx from "./BPCtx"

export default class BPEmberCtx extends BPCtx {
    public type: string = "ember"
    private cmds: any[] = []
    private compTypeList: any[] = []
    private currentCompTypeList: any[] = []
    private output: string = ""

    constructor(projectName: string) {
        super()
        phLogger.info("exec something with emberjs")
        this.projectName = projectName
        this.output = configResult.getOutput()
    }

    public cmdStart() {
        const { output, projectName } = this
        if (configResult.getIsAddon()) {
            return [
                new CdExec(output),
                new RemoveFolderExec(projectName),
                new EmberAddonExec(projectName), // TODO 改名.不仅仅是生成 addon 了
                new CdExec(output + "/" + projectName),
                new EmberYarnExec("install"),
                new EmberGenExec("component", "cp-leaf"),
                new EmberYarnExec("add", "ember-cli-sass ", "--save"),
                new EmberYarnExec("add", "sass ", "--save")
            ]
        }
        return [
            new CdExec(output),
            new RemoveFolderExec(projectName),
            new EmberAddonExec(projectName), // TODO 改名.不仅仅是生成 addon 了
            new CdExec(output + "/" + projectName),
            new EmberYarnExec("install"),
            new EmberInstallDepExec("ember-cli-sass")
        ]
    }

    public cmdEnd() {
        const { output, projectName } = this
        const slot = new BPSlot(output, projectName, "index")
        const cpLeaf = new BPComp()
        cpLeaf.id = "cp-leaf"
        cpLeaf.type = "cpLeaf"
        cpLeaf.name = "cp-leaf"
        cpLeaf.cat = "0"

        const geneSlot = slot.paint(this, cpLeaf, false)
        if (configResult.getIsAddon()) {
            return [
                new EmberYarnExec("remove", "ember-cli-htmlbars"),
                new EmberInstallDepExec("ember-cli-htmlbars@3.0.0", "-S"),
                new EmberInstallDepExec("ember-svg-jar", "-S"),
                new EmberInstallDepExec("ember-cli-echarts"),
                new EmberInstallDepExec("@ember/jquery"),
                new EmberInstallDepExec("@ember/optional-features"),
                new EmberInstallDepExec("jquery-integration", "-D", "feature:enable"),
                new EmberInstallDepExec("ember-truth-helpers"),
                new EmberInstallDepExec("ember-table"),
                new EmberInstallDepExec("ember-ajax"),
                geneSlot[0],
                new AddSvgFiles(output, projectName),
                new AddBaseClass(output, projectName),
                new SassyStyles(output, projectName),
                new AddChartTools(output, projectName)
            ]
        } else {
            return [
                new EmberInstallDepExec("ember-cli-echarts"),
                new EmberInstallDepExec("ember-truth-helpers"),
                new EmberInstallDepExec("ember-table")
            ]
        }
    }

    public paintMW(route: BPMainWindow, components: BPComp[]) {
        const isAddon = configResult.getIsAddon()

        this.compTypeList = this.genCompTypeList(route.routeName)
        // 1. 生成路由
        if (isAddon) {
            this.cmds.push(new EmberGenExec("route", route.routeName, "--dummy"))
        } else {
            this.cmds.push(new EmberGenExec("route", route.routeName))
        }
        // 2. 生成当前路由下的 component
        this.paintComps(components)

        this.paintHelpers() // 测试 生成helper
        // 3. 重写文件，将上面的组件进行展示
        this.showComp(components)
        this.mwStyles(route)
        this.moveLayDateFiles()
        // 4. 将执行命令抛出
        return this.runExec()
    }

    /**
     * getAllComponents
     */
    public getAllComponents(components: BPComp[]) {
        if (!components) { return [] }
        let comps: BPComp[] = []

        for (const element of components) {
            if (element.cat === "0") {
                comps.push(element)
            }

            const inner = this.getAllComponents(element.components)
            comps = comps.concat(inner)

        }

        return comps
    }

    // 思考 helper 的优化
    public paintHelpers() {
        const { output, projectName } = this
        const helpersName = ["bp-eq", "belong-to", "some-belong-to"]
        const helperCalss = [
            new BPEq(output, projectName, ""),
            new BPBelongTo(output, projectName, ""),
            new BPSomeBelongTo(output, projectName, "")
        ]

        for (const name of helpersName) {
            this.cmds.push(new EmberGenExec("helper", name))
        }

        for (const helper of helperCalss) {
            this.cmds.push(...helper.paint())
        }
    }

    public paintComps(components: BPComp[]) {
        const curComps = this.getAllComponents(components)
        this.currentCompTypeList = []

        for (let i = 0, len = curComps.length; i < len; i++) {
            const component = curComps[i]

            this.cmds.push(new EmberGenExec("component", component.name))

            this.currentCompTypeList.push(this.compTypeList.find((x) => x.constructor.name === component.type))
        }
    }

    private genCompTypeList(routeName: string) {
        // TODO 生成目前所有组件类的全集
        const compList = new GenCompList(this.output, this.projectName, routeName)

        return compList.createList()
    }

    private showComp(components: BPComp[]) {
        const curComps = this.getAllComponents(components)
        const currentCompTypeList = this.currentCompTypeList
        const that = this

        // 每个类的 paintStylesShow() 方法放入了 BPWidget
        currentCompTypeList.forEach((comp, index: number) => {
            this.cmds.push(...comp.paint(that, curComps[index], false))
        })
        components.forEach((compConf: BPComp) => {
            const compIns = this.compTypeList.find((x) => x.constructor.name === compConf.type)
            this.cmds.push(...compIns.paintStylesShow(compConf))
        })
    }

    private mwStyles(route: BPMainWindow) {
        this.cmds.push(new GenMWStylesExec(this.output, this.projectName, route))
    }

    // laydate files 因为对源码进行了修改，所以不能直接引入使用
    private moveLayDateFiles() {
        this.cmds.push(new AddLayDateFiles(this.output, this.projectName))
    }

    private runExec() {
        return this.cmds
    }
}
