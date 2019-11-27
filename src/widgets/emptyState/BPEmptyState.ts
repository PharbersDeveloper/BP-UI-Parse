"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPEmptyState extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
            super(output, name, routeName)
        }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean) {
        const execList: any[] = []

        const options: IOptions = {
                comp,
                hbsData: this.paintHBS(comp),
                logicData: this.paintLogic(comp), // js
                output: this.output,
                pName: this.projectName,
                rName: this.routeName,
                showData: this.paintShow(comp), // hbs
                styleData: this.paintStyle(comp) //  继承自 BPWidget 的方法, css
        }
        execList.push(new CompExec(options, isShow))

        return execList
        }
    public paintShow(comp: BPComp) {
        return "{{#" + comp.name + "}}" + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        let fileData = "import { computed } from '@ember/object';" + "\r" +
            "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['empty-state']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" +
            "    didInsertElement() {" + "\r" +
            "        this._super(...arguments);" + "\r" +
            "    }," + "\r" +
            "    actions: {" + "\r"

        fileData = fileData  + "}"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        const imgLink = comp.attrs.img ? `<img src="${comp.attrs.img}">` : ""
        const title = comp.attrs.title ? `<div class="empty-state-title">${comp.attrs.title}</div>` : ""
        const desc = comp.attrs.desc ? `<div class="empty-state-desc">${comp.attrs.desc}</div>` : ""
        const pAction = comp.attrs.primaryAction ? `<button class="empty-state-btn-p">${comp.attrs.primaryAction}</button>` : ""
        const sAction = comp.attrs.secondaryAction ? `<button class="empty-state-btn-s">${comp.attrs.secondaryAction}</button>` : ""
        const link = comp.attrs.link ? `<a href="${comp.attrs.link.href}" class="empty-state-link">${comp.attrs.link.name}</a>` : ""
        const actions = pAction || sAction ? `<div class="empty-state-actions">${pAction}${sAction}</div>` : ""

        const content = `${imgLink}
                        ${title}
                        ${desc}
                        ${actions}
                        ${link}`

        return content
    }
}
