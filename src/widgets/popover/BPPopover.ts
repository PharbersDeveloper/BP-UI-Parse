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
            "    classNames:['']," + "\r" +
            // "    classNames:['" + comp.name + "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" +
            "    popoverPlace: '" + comp.attrs.placement + "'," + "\r" +
            "    actions: {" + "\r"

        fileData = fileData + "dismiss(event) { " + "\r" +
                "    let ev = event || window.event" + "\r" +
                "    let cur = ev.target" + "\r" +
                "    while(cur.parentElement.classList.value.indexOf('popover-container') === -1) {" + "\r" +
                "        cur = cur.parentElement" + "\r" +
                "    }" + "\r" +
                "    cur.parentElement.style.display = 'none'" + "\r" +
                "},"

        fileData = fileData +
                "togglePopover(event) { " + "\r" +
                "    let ev = event || window.event" + "\r" +
                "    let popover = ev.target.nextElementSibling" + "\r" +
                "    if (popover.style.display === 'none' || !popover.style.display) { " + "\r" +
                "        popover.style.display = 'block'" + "\r" +
                "    } else { " + "\r" +
                "        popover.style.display = 'none'" + "\r" +
                "    }" + "\r" +
                "    let btnWidth = ev.target.offsetWidth" + "\r" +
                "    let btnHeight = ev.target.offsetHeight" + "\r" +
                "    let popoverHeight = popover.offsetHeight" + "\r" +
                "    let popoverWeight = popover.offsetWidth" + "\r" +
                "    switch(this.popoverPlace) { " + "\r" +
                "        case 'right':" + "\r" +
                "            // x = btnWidth + 10" + "\r" +
                "            // y = -(popoverHeight / 2) + 4" + "\r" +
                "            popover.style.transform =  'translate3d(' + ( btnWidth + 20 ) + 'px, ' + ((btnHeight-popoverHeight) / 2) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'right-top':" + "\r" +
                "            // x = btnWidth + 10" + "\r" +
                "            // y = -(btnHeight / 2)" + "\r" +
                "            popover.style.transform =  'translate3d(' + ( btnWidth + 20 ) + 'px, ' + (btnHeight / 2 - 24) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'right-bottom':" + "\r" +
                "            // x = btnWidth + 10" + "\r" +
                "            // y = -(popoverHeight - btnHeight + 4)" + "\r" +
                "            popover.style.transform =  'translate3d(' + ( btnWidth + 20 ) + 'px, ' + (btnHeight/2-24-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'left':" + "\r" +
                "            // x = -(popoverWeight + 20)" + "\r" +
                "            // y = -(popoverHeight / 2) + 4" + "\r" +
                "            popover.style.transform =  'translate3d(' + (-20-popoverWeight) + 'px, ' + ((btnHeight-popoverHeight)/2) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'left-top':" + "\r" +
                "            // x = 20-popoverWeight" + "\r" +
                "            // y =  -(btnHeight / 2)" + "\r" +
                "            popover.style.transform =  'translate3d(' + (-20-popoverWeight) + 'px, ' + (btnHeight / 2 - 24) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'left-bottom':" + "\r" +
                "            // x = 20-popoverWeight" + "\r" +
                "            // y = -(popoverHeight - btnHeight + 4)" + "\r" +
                "            popover.style.transform =  'translate3d(' + (-20-popoverWeight) + 'px, ' + (btnHeight/2-24-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'top':" + "\r" +
                "            // x = -(popoverWeight/2 - btnWidth/2  + 4)" + "\r" +
                "            // y = -(popoverHeight + 20)" + "\r" +
                "            popover.style.transform =  'translate3d(' + ((btnWidth-popoverWeight)/2) + 'px, ' + (-20-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'top-right':" + "\r" +
                "            // x = -(popoverWeight - btnWidth/2 -20)" + "\r" +
                "            // y = 20-popoverHeight" + "\r" +
                "            popover.style.transform =  'translate3d(' + ( 20 + btnWidth/2 - popoverWeight) + 'px, ' + (-20-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'top-left':" + "\r" +
                "            // x = (btnWidth/2 - 30)" + "\r" +
                "            // y = 20-popoverHeight" + "\r" +
                "            popover.style.transform =  'translate3d(' + ((btnWidth/2 - 30)) + 'px, ' + (-20-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'bottom':" + "\r" +
                "            // x = (btnWidth-popoverWeight)/2" + "\r" +
                "            // y = (btnHeight + 10)" + "\r" +
                "            popover.style.transform =  'translate3d(' + ((btnWidth-popoverWeight)/2) + 'px, ' + (btnHeight + 20) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'bottom-right':" + "\r" +
                "            //x =  20 + btnWidth/2 - popoverWeight" + "\r" +
                "            //y = (btnHeight + 20)" + "\r" +
                "            popover.style.transform =  'translate3d(' + ( 20 + btnWidth/2 - popoverWeight) + 'px, ' + (btnHeight + 20) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'bottom-left':" + "\r" +
                "            //x = (btnWidth/2 - 30)" + "\r" +
                "            //y = (btnHeight + 20)" + "\r" +
                "            popover.style.transform =  'translate3d(' + ((btnWidth/2 - 30)) + 'px, ' + (btnHeight + 20) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        default:" + "\r" +
                "            break" + "\r" +
                "    }" + "\r" +
                "}"

        fileData = fileData  + "}"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        const position = "popover-triangle-" + comp.attrs.placement
        let icon = ""
        let dismiss = ""
        let link = ""
        let actions = ""
        let popoverToggle = "<button onclick={{action 'togglePopover'}} class='" + comp.name + "'>" + comp.text + "</button>"

        if (comp.attrs.messageState) {
            icon = "<span>{{svg-jar '" + comp.attrs.messageState +
                    "' width='24px' height='24px' class='icon icon-pointer icon-" + comp.attrs.messageState + "' }}</span>"
        }

        if (comp.attrs.dismiss === "true") {
            dismiss = "<span onclick={{action 'dismiss'}}>{{svg-jar 'cross' width='24px' height='24px' class='icon-pointer' }}</span>"
        }

        if (comp.attrs.link) {
            link = "<a href='" + comp.attrs.link.href + "'>" + comp.attrs.link.name + "</a>"
        }

        if (comp.attrs.actions === "true") {
            actions = "<button onclick={{action 'dismiss'}}>Cancel</button><button>Confirm</button>"
        }

        if (comp.attrs.input === "true") {
            popoverToggle = "<input type='text' onclick={{action 'togglePopover'}} class='" + comp.name + "'>"
        }

        return  "<div class='popover-wrapper'>" + popoverToggle + "\r" +
                "<div class='popover-container'>" + "\r" +
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
                "</div>" + "\r" +
                "</div>"
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
