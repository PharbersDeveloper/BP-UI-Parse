"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPModal extends BPWidget {
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
        const compId = this.transName(comp.name)
        const toggleShow = comp.attrs.show === "true" ? "toggleShow: true," + "\r" : "toggleShow: false," + "\r"

        let fileData = "import { computed } from '@ember/object';" + "\r" +
            "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" + toggleShow + "\r" +
            "    didInsertElement() {" + "\r" +
            "        this._super(...arguments);" + "\r" +
            "        if (this.toggleShow) { " + "\r" +
            "            this.actions.stopBodyScroll(1)" + "\r" +
            "        }" + "\r" +
            "    }," + "\r" +
            "    actions: {" + "\r"

        fileData = fileData +
                "    stopBodyScroll(isFixed) { " + "\r" +
                "       let bodyEl = document.body" + "\r" +
                "       let top = 0" + "\r" +
                "       if (isFixed) { " + "\r" +
                "           top = window.scrollY" + "\r" +
                "           bodyEl.style.position = 'fixed'" + "\r" +
                "           bodyEl.style.top = -top + 'px'" + "\r" +
                "           document.getElementById('" + compId + "').style.top = '0px'" + "\r" +
                "           document.getElementById('" + compId + "').classList.add('modal-container-flex')" + "\r" +
                "           setTimeout(function() {document.getElementById('" + compId + "').classList.add('modal-show')}, 0)" + "\r" +
                "       } else { " + "\r" +
                "           document.getElementById('" + compId + "').classList.add('modal-fade')" + "\r" +
                "           document.getElementById('" + compId + "').classList.remove('modal-show')" + "\r" +
                "           setTimeout(function() {document.getElementById('" + compId + "').classList.remove('modal-container-flex')}, 150)" + "\r" +
                "           let num = Math.abs(Number(bodyEl.style.top.split('px')[0]))" + "\r" +
                "           bodyEl.style.position = ''" + "\r" +
                "           bodyEl.style.top = ''" + "\r" +
                "           window.scrollTo(0, num)" + "\r" +
                "        }" + "\r" +
                "    }," + "\r" +
                "    changeShowState() { " + "\r" +
                "        this.toggleProperty('toggleShow')" + "\r" +
                "           if (this.toggleShow) {" + "\r" +
                "               this.actions.stopBodyScroll(1)" + "\r" +
                "           } else { " + "\r" +
                "                this.actions.stopBodyScroll(0)" + "\r" +
                "           }" + "\r" +
                "    }," + "\r"

        fileData = fileData  + "}"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        let btn = "modal-default-btn"
        let icon = ""
        let clickCross = ""
        let btnControl = "<button  {{action 'changeShowState'}} class='modal-control-btn "
                        + comp.name + "'>" + comp.text + "</button>"
        const id = this.transName(comp.name)
        const msg = comp.attrs.button ? comp.attrs.button : "Button"
        const cancel = comp.attrs.cancel ? comp.attrs.cancel : "Cancel"
        const size = comp.attrs.size ? comp.attrs.size : "small"
        const modalSize = "modal-" + size
        const scrollable = comp.attrs.type === "scrollable" ? " modal-scrollable " : ""
        const bgClose = comp.attrs.bgClose === "false" ? "" : "{{action 'changeShowState'}}"

        if (comp.icon === "error") {
            btn = "modal-error-btn"
        } else if (comp.icon === "warning") {
            btn = "modal-warning-btn"
        }

        if (comp.icon) {
            icon = "{{svg-jar '" + comp.icon + "' width='24px' height='24px' class='icon icon-" + comp.icon + "' }}"
        }

        if (comp.attrs.closeIcon === "true") {
            clickCross = "<span {{action 'changeShowState' bubbles=false}}>{{svg-jar 'cross' width='24px' height='24px' class='icon icon-pointer' }}</span>"
        }

        if (comp.attrs.btnControl === "false") {
            btnControl = ""
        }

        return "<div class='modal-container modal-fade " + scrollable  +  "' id='" + id + "' " + bgClose + ">" + "\r"
                + "    <div class='modal " + modalSize + "'>" + "\r"
                + "        <div class='modal-title'><div>" + icon + comp.attrs.title  + "</div>"
                + clickCross + "</div>" + "\r"
                + "        <div class='modal-body '>" + comp.attrs.content + "</div>" + "\r"
                + "        <div class='modal-footer'><button class='" + btn + "'>" + msg + "</button><button {{action 'changeShowState' bubbles=false}} class='modal-subtle-btn'>" + cancel + "</button></div>" + "\r"
                + "    </div>" + "\r"
                + "</div>" + "\r"
                + btnControl
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
