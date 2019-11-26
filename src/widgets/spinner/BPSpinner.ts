"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPSpinner extends BPWidget {
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

        const fileData = "\n" +
            "import {computed} from '@ember/object';" + "\r" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name +  "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" +
            "    show: true,"
        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        const spinnerClass = comp.attrs.fullWindow === "true" ? "full-window-spinner" : "item-spinner"
        const bgCOlor = comp.attrs.background === "gray" ? "spinner-background-gray" : "spinner-background-white"
        let size = "24px"

        if (comp.attrs.size === "large") {
            size = "48px"
        } else if (comp.attrs.size === "small") {
            size = "16px"
        } else if (comp.attrs.size === "x-small") {
            size = "8px"
        }

        return "{{#if show}}" + "\r" +
        "<div class='" + spinnerClass + " " + bgCOlor + "'>" + "\r" +
        "<span class='spinner-animate'>" +
        "{{svg-jar 'Spinner' width='" + size + "' height='" + size + "' }}</span>" + "\r" +
        "</div>{{/if}}"
    }

}
