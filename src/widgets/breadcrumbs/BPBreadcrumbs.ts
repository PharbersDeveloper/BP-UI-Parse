"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPBreadcrumbs extends BPWidget {
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
        // const contentArray = comp.attrs.contents.split(",")

        const fileData = "\n" +
            "import {computed} from '@ember/object';" + "\r" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name +  "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" +
            // "    contentArray: '" + contentArray + "]," + "\r" +
            "    showAll: false," + "\r" +
            "    actions: { " + "\r" +
            "        toggleShowAll() { " + "\r" +
            "            this.toggleProperty('showAll')" + "\r" +
            "        }," + "\r" +
            "    }," + "\r"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        let content = ""
        let contentAll = ""
        let contentPart = ""
        const arrayContent = comp.attrs.contents.split(",")
        const len = arrayContent.length
        if (len > 5) {
            contentPart = "<div>" + arrayContent[0] + "</div>"
            contentPart += "<span>/</span>" + "\r" +
                        "<span onclick={{action 'toggleShowAll'}} class='breadcrumbs-show'>... </span>" + "\r" +
                        "<span>/</span>"
            contentPart += "<div>" + arrayContent[len - 1] + "</div>"
        }
        for (let i = 0; i < len; i++) {
            contentAll += "<div>" + arrayContent[i] + "</div>"
            if (i !== len - 1) {
                contentAll += "<span>/</span>"
            }
        }

        content = "{{#if showAll}}" + "\r" +
                contentAll + "\r" +
                "{{else}}" + "\r" +
                contentPart + "\r" +
                "{{/if}}" + "\r"

        return "<div class='breadcrumbs-container'>" + "\r" +
        content + "\r"  +
        "</div>"
    }
}
