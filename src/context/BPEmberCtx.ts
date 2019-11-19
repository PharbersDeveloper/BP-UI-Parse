"use strict"

// import { EmberAddonExec } from "../bashexec/addonExec"
import { AddBaseClass } from "../bashexec/addBaseClass"
import { EmberAddonExec } from "../bashexec/addonExec"
import { AddSvgFiles } from "../bashexec/addSvgFiles"
import { BashSpwanCmds } from "../bashexec/bashcmdlst"
import { CdExec } from "../bashexec/cdExec"
import { EmberGenExec } from "../bashexec/emberGenExec"
import { EmberInstallDepExec } from "../bashexec/emberInstallDepExec"
import { EmberYarnExec } from "../bashexec/emberYarn"
import { GenMWStylesExec } from "../bashexec/genMWStylesExec"
import { RemoveFolderExec } from "../bashexec/removeFolderExec"
import { SassyStyles } from "../bashexec/sassyStyles"
import phLogger from "../logger/phLogger"
import BPBadge from "../widgets/badges/BPBadge"
import BPItem from "../widgets/basic/BPItem"
import { BPWidget } from "../widgets/BPWidget"
import BPBreadcrumbs from "../widgets/breadcrumbs/BPBreadcrumbs"
import BPPushButton from "../widgets/buttons/BPPushButton"
import BPBar from "../widgets/charts/BPBar"
import BPChina from "../widgets/charts/BPChina"
import BPLine from "../widgets/charts/BPLine"
import BPPie from "../widgets/charts/BPPie"
import BPScatter from "../widgets/charts/BPScatter"
import BPCheckbox from "../widgets/checkbox/BPCheckbox"
import BPComp from "../widgets/Comp"
import BPDiv from "../widgets/div/BPDiv"
import BPDivider from "../widgets/divider/BPDivider"
import BPOption from "../widgets/dropdown/BPOption"
import BPSelect from "../widgets/dropdown/BPSelect"
import BPImg from "../widgets/img/BPImg"
import BPInput from "../widgets/inputs/BPInput"
import BPLabel from "../widgets/label/BPLabel"
import BPLink from "../widgets/link/BPLink"
import BPModal from "../widgets/modal/BPModal"
import BPMenu from "../widgets/navs/BPMenu"
import BPMenuItem from "../widgets/navs/BPMenuItem"
import BPStackLayout from "../widgets/navs/BPStackLayout"
import BPSubMenu from "../widgets/navs/BPSubMenu"
import BPTab from "../widgets/navs/BPTab"
import BPTabBar from "../widgets/navs/BPTabBar"
import BPTabButton from "../widgets/navs/BPTabButton"
import BPPagination from "../widgets/pagination/BPPagination"
import BPPopover from "../widgets/popover/BPPopover"
import BPProcessTracker from "../widgets/progressTracker/BPProcessTracker"
import BPRadio from "../widgets/radio/BPRadio"
import BPScrollBar from "../widgets/scrollBar/BPScrollBar"
import BPSpinner from "../widgets/spinner/BPSpinner"
import BPStatus from "../widgets/status/BPStatus"
import BPTable from "../widgets/table/BPTable"
import BPTag from "../widgets/tags/BPTag"
import BPTextarea from "../widgets/textarea/BPTextarea"
import BPToast from "../widgets/toast/BPToast"
import BPTooltip from "../widgets/tooltip/BPTooltip"
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
        // const output: string = "/Users/frank/Documents/work/pharbers/nocode-output"
        const output: string = "/Users/Simon/Desktop/ui-output"
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
            new EmberInstallDepExec("ember-ajax")
        ]

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
            if (element.cat === "0") {
                comps.push(element)
            }
            // comps.push(element)
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

            this.cmds.push(new EmberGenExec("component", component.name))   // 会重复生成某一组件，需要在

            this.currentCompTypeList.push(compTypeList.find((x) => x.constructor.name === component.type))
            // 把最外层的组件 放进 currentComp... 里面
        }
    }
    private genCompTypeList(routeName: string) {
        // TODO 生成目前所有组件类的全集
        this.compTypeList = [
            new BPTable(this.output, this.projectName, routeName),
            new BPBreadcrumbs(this.output, this.projectName, routeName),
            new BPPagination(this.output, this.projectName, routeName),
            new BPSpinner(this.output, this.projectName, routeName),
            new BPProcessTracker(this.output, this.projectName, routeName),
            new BPPopover(this.output, this.projectName, routeName),
            new BPModal(this.output, this.projectName, routeName),
            new BPToast(this.output, this.projectName, routeName),
            new BPTooltip(this.output, this.projectName, routeName),
            new BPLink(this.output, this.projectName, routeName),
            new BPTextarea(this.output, this.projectName, routeName),
            new BPCheckbox(this.output, this.projectName, routeName),
            new BPRadio(this.output, this.projectName, routeName),
            new BPLabel(this.output, this.projectName, routeName),
            new BPDiv(this.output, this.projectName, routeName),
            new BPImg(this.output, this.projectName, routeName),
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
            new BPOption(this.output, this.projectName, routeName),
            new BPLine(this.output, this.projectName, routeName),
            new BPBar(this.output, this.projectName, routeName),
            new BPPie(this.output, this.projectName, routeName),
            new BPScatter(this.output, this.projectName, routeName),
            new BPChina(this.output, this.projectName, routeName)

        ]

        return this.compTypeList
    }

    private showComp(components: BPComp[]) {
        const curComps = this.getAllComponents(components)
        const showComps: string[] = components.map((comp) => comp.name)
        const currentCompTypeList = this.currentCompTypeList
        const that = this
        const uniqCompList = [...new Set(currentCompTypeList)]

        curComps.forEach((item) => {
            showComps.forEach((sc, i) => {
                // const isShow: boolean = sc === item.type
                const isShow: boolean = sc === item.name
                const paintComp = uniqCompList.filter((uc) => uc.constructor.name === item.type)[0]
                that.cmds.push(...paintComp.paint(that, isShow ? components[i] : item, isShow))
            })
        })
        // 每一个 BPxxxx 类有自己的paint方法
        // paint 方法返回 compExec 类的执行方法 exec
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
