"use strict"

// import { EmberAddonExec } from "../bashexec/addonExec"
import {AddBaseClass} from "../bashexec/addBaseClass"
import { EmberAddonExec } from "../bashexec/addonExec"
import {AddSvgFiles} from "../bashexec/addSvgFiles"
import { BashSpwanCmds } from "../bashexec/bashcmdlst"
import { CdExec } from "../bashexec/cdExec"
import { EmberGenExec } from "../bashexec/emberGenExec"
import { EmberInstallDepExec } from "../bashexec/emberInstallDepExec"
import { EmberYarnExec } from "../bashexec/emberYarn"
import { GenMWStylesExec } from "../bashexec/genMWStylesExec"
import { RemoveFolderExec } from "../bashexec/removeFolderExec"
import { SassyStyles } from "../bashexec/sassyStyles"
import phLogger from "../logger/phLogger"
import BPAvatar from "../widgets/avatars/BPAvatar"
import BPBadge from "../widgets/badges/BPBadge"
import BPItem from "../widgets/basic/BPItem"
import { BPWidget } from "../widgets/BPWidget"
import BPPushButton from "../widgets/buttons/BPPushButton"
import BPComp from "../widgets/Comp"
import BPDiv from "../widgets/div/BPDiv"
import BPDivider from "../widgets/divider/BPDivider"
import BPSelect from "../widgets/dropdown/BPSelect"
import BPInput from "../widgets/inputs/BPInput"
import BPLabel from "../widgets/label/BPLabel"
import BPMenu from "../widgets/navs/BPMenu"
import BPMenuItem from "../widgets/navs/BPMenuItem"
import BPStackLayout from "../widgets/navs/BPStackLayout"
import BPSubMenu from "../widgets/navs/BPSubMenu"
import BPTab from "../widgets/navs/BPTab"
import BPTabBar from "../widgets/navs/BPTabBar"
import BPTabButton from "../widgets/navs/BPTabButton"
import BPRadio from "../widgets/radio/BPRadio"
import BPScrollBar from "../widgets/scrollBar/BPScrollBar"
import BPStatus from "../widgets/status/BPStatus"
import BPTag from "../widgets/tags/BPTag"
import BPMainWindow from "../widgets/windows/BPMainWindow"
import BPCtx from "./BPCtx"

import BPOption from "../widgets/dropdown/BPOption"

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
        const output: string = "/Users/frank/Documents/work/pharbers/nocode-output"
        // const output: string = "/Users/Simon/Desktop/ui-output"
        this.output = output
    }
    public cmdStart() {
        return [
            new CdExec(this.output),
            new RemoveFolderExec(this.projectName),
            new EmberAddonExec(this.projectName),
            new CdExec(this.output + "/" + this.projectName),
            new EmberYarnExec("install")
        ]
    }
    public cmdEnd() {
        return [new EmberYarnExec("remove", "ember-cli-htmlbars"), new EmberInstallDepExec("ember-cli-htmlbars@3.0.0", "-S"),
                new EmberInstallDepExec("ember-svg-jar", "-S")]

    }
    public paintMW(route: BPMainWindow, components: BPComp[]) {
        this.genCompTypeList(route.routeName)
        // 1. 生成路由
        this.cmds.push(new EmberGenExec("route", route.routeName, "--dummy"))
        // 2. 生成当前路由下的 component
        this.paintComps(components)
        // 3. 重写文件，将上面的组件进行展示
        this.showComp(components)
        // 生成公有样式 scss 变量，为以后的插件使用 scss 作准备。
        // this.generaSassyStyles()
        this.mwStyles(route)
        this.moveBaseClass()
        // 4. 将执行命令抛出
        return this.runExec()
    }

    /**
     * getAllComponents
     */
    public getAllComponents(components: BPComp[]) {
        let comps: BPComp[] = []

        for (const element of components) {
            // if (element.cat === "0") {
            //     comps.push(element)
            // }
            comps.push(element)
            // }

            const inner = this.getAllComponents(element.components)
            comps = comps.concat(inner)

        }
        return comps
    }

    public paintComps(components: BPComp[]) {
        const curComps = this.getAllComponents(components)

        const compTypeList = this.compTypeList
        this.currentCompTypeList = []
        for (let i = 0, len = curComps.length; i < len; i++) {
            const component = curComps[i]

            this.cmds.push(new EmberGenExec("component", component.name))

            this.currentCompTypeList.push(compTypeList.find((x) => x.constructor.name === component.type))
        }
    }
    private genCompTypeList(routeName: string) {
        // TODO 生成目前所有组件类的全集
        this.compTypeList = [
            new BPRadio(this.output, this.projectName, routeName),
            new BPLabel(this.output, this.projectName, routeName),
            new BPDiv(this.output, this.projectName, routeName),
            new BPAvatar(this.output, this.projectName, routeName),
            new BPTag(this.output, this.projectName, routeName),
            new BPStatus(this.output, this.projectName, routeName),
            new BPBadge(this.output, this.projectName, routeName),
            new BPScrollBar(this.output, this.projectName, routeName),
            new BPDivider(this.output, this.projectName, routeName),
            new BPInput(this.output, this.projectName, routeName),
            new BPPushButton(this.output, this.projectName, routeName),
            new BPMenu(this.output, this.projectName, routeName),
            new BPSubMenu(this.output, this.projectName, routeName),
            new BPMenuItem(this.output, this.projectName, routeName),
            new BPTabBar(this.output, this.projectName, routeName),
            new BPItem(this.output, this.projectName, routeName),
            new BPStackLayout(this.output, this.projectName, routeName),
            new BPTabButton(this.output, this.projectName, routeName),
            new BPTab(this.output, this.projectName, routeName),
            new BPSelect(this.output, this.projectName, routeName),
            new BPOption(this.output, this.projectName, routeName)

        ]

        return this.compTypeList
    }

    private showComp(components: BPComp[]) {
        const curComps = this.getAllComponents(components).filter((comp) => comp.cat === "0")
        const showComps: string[] = components.map((comp) => comp.name)
        const currentCompTypeList = this.currentCompTypeList
        const that = this

        currentCompTypeList.forEach((item, index) => {
            const curComp = curComps[index]
            const isShowComp: boolean = showComps.includes(curComp.name)

            that.cmds.push(...item.paint(that, curComps[index], isShowComp))
        })
    }
    private mwStyles(route: BPMainWindow) {
        this.cmds.push(new GenMWStylesExec(this.output, this.projectName, route))
    }
    private generaSassyStyles() {
        this.cmds.push(new SassyStyles(this.output, this.projectName))
    }
    private moveBaseClass() {
        this.cmds.push(new AddBaseClass(this.output, this.projectName),
            new AddSvgFiles(this.output, this.projectName))
    }
    private runExec() {
        return this.cmds
    }
}
