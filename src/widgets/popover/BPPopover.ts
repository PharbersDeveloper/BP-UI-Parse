"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPPopover extends BPWidget {
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

        let fileData = "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name + "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" +
            "    actions: {" + "\r"

        fileData = fileData  + "}"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        const position = "popover-triangle-" + comp.attrs.placement
        let icon = ""
        let dismiss = ""
        let link = ""
        let actions = ""

        if (comp.attrs.messageState) {
            icon = "<span>{{svg-jar '" + comp.attrs.messageState +
                    "' width='24px' height='24px' class='icon icon-pointer icon-" + comp.attrs.messageState + "' }}</span>"
        }

        if (comp.attrs.dismiss === "true") {
            dismiss = "<span>{{svg-jar 'cross' width='24px' height='24px' class='icon-pointer' }}</span>"
        }

        if (comp.attrs.link) {
            link = "<a href='" + comp.attrs.link.href + "'>" + comp.attrs.link.name + "</a>"
        }

        if (comp.attrs.actions === "true") {
            actions = "<button>Cancel</button><button>Confirm</button>"
        }

            // "{{svg-jar 'cross' width='24px' height='24px' class='icon icon-pointer' }}" : ""
        return "<div class='popover-container'>" + "\r" +
                "<div class='popover'>" + "\r" +
                icon + "\r" +
                "<div class='popover-content'>" + "\r" +
                "<div class='popover-head'>" + "\r" +
                "<div class='popover-title'>" + comp.attrs.title + "</div>" + "\r" +
                dismiss + "\r" +
                "</div>" + "\r" +
                "<div class='popover-desc'>" + comp.attrs.desc + "</div>" + "\r" +
                "<div class='popover-footer'>" + link + actions  + "</div>" +
                "</div>" + "\r" +
                "</div>" + "\r" +
                "<div class='popover-triangle " + position + "'></div>" +
                "</div>" + "\r"
    }

    public transName(name: string) {
        const arr = name.split("-")
        for (let i = 0; i < arr.length; i++) {
            const [first, ...rest] = arr[i]
            arr[i] = first.toUpperCase() + rest.join("")
        }
        return arr.join("")
    }
}
