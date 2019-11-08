"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPToast extends BPWidget {
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
        if (comp.components.length === 0) {
            return "{{#" + comp.name + " toastDisappear=(action 'toastDisappear') }}" + "{{/" + comp.name + "}}"
            // toast 子组件绑定函数
        }
        return "{{#" + comp.name + "}}" + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        let toggleShow = ""
        let positionParam = "    positionalParams: ['toastDisappear']," + "\r"
        let toggleShowFunc = ""

        // toast container
        if (comp.components.length !== 0) {
            comp.components.forEach((icomp) => {
                toggleShow += "    " + this.transName(icomp.name) + ": true," + "\r"
            })

            positionParam = "" + "\r"

            toggleShowFunc = "toastDisappear(name) {" + "\r" +
                             "    this.set(name, false)" + "\r" +
                             "}," + "\r"
        }

        let fileData = "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name + "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" + toggleShow + positionParam +
            "    actions: {" + "\r" + toggleShowFunc

        if (comp.attrs.clickEvent === "true") {
            fileData = fileData +
                "    disappear(name) { " + "\r" +
                "       this.toastDisappear('" + this.transName(comp.name) + "') " + "\r" +
                "   }," + "\r"
        }

        fileData = fileData  + "}"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        if (comp.name.indexOf("container") === -1) {
            let clickPart = ""
            let linkPart = ""
            const iconColor = comp.icon === "warning" ? "icon-toast-warning" : "icon-white"

            if (comp.attrs.clickEvent === "true") {
                const crossColor = comp.icon === "warning" ? "icon-warning-cross" : "icon-white"
                clickPart = "<span {{action 'disappear' '" + comp.name +
                    "'}}>{{svg-jar 'cross' width='24px' height='24px' class='" + crossColor + " icon-pointer' }}</span>"
            }

            if (comp.attrs.link) {
                linkPart = "<a class='toast-inline-link' href='" + comp.attrs.link.href + "'>" + comp.attrs.link.name + "</a>"
            }

            return  "<div class='flex-alian-center'>{{svg-jar '" + comp.icon + "' width='24px' height='24px' class='icon " + iconColor + "'}}" +
                comp.text  + linkPart + "</div>" + clickPart
        } else {
            const insideComps = comp.components

            if (insideComps.length !== 0) {

                let showBody = ""
                insideComps.forEach((icomp) => {
                    const innerToast = new BPToast(this.output, this.projectName, this.routeName)
                    showBody +=  "{{#if " + this.transName(icomp.name) + "}}" + innerToast.paintShow(icomp) + "{{/if}}"
                })
                return showBody
            }
        }
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
