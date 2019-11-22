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

        fileData = fileData + "dismiss(event) { " + "\r" +
                "    let ev = event || window.event" + "\r" +
                "    let cur = ev.target" + "\r" +
                "    while(cur.parentElement.classList.value.indexOf('popover-container') === -1) {" + "\r" +
                "        cur = cur.parentElement" + "\r" +
                "    }" + "\r" +
                "    cur.parentElement.style.display = 'none'" + "\r" +
                "},"

        fileData = fileData +
                `togglePopover(event) {
                    const element = document.getElementsByClassName("${comp.name}")[0]
                    const togglePopoverItem = element.previousElementSibling
                    const popover = element.childNodes[0]

                    if (popover.style.display === 'none' || !popover.style.display) {
                        popover.style.display = 'block'
                    } else {
                        popover.style.display = 'none'
                    }


                    const itemHeight = togglePopoverItem.offsetHeight
                    const itemWidth = togglePopoverItem.offsetWidth
                    const popoverHeight = popover.offsetHeight
                    const popoverWeight = popover.offsetWidth
                    const popoverPlace = "${comp.attrs.placement}"

                    switch(popoverPlace) {
                        case 'right':
                            popover.style.transform =  'translate3d(' + ( itemWidth + 20 ) + 'px, ' + ((itemHeight-popoverHeight) / 2) + 'px, 0px' +')'
                            break
                        case 'right-top':
                            popover.style.transform =  'translate3d(' + ( itemWidth + 20 ) + 'px, ' + (itemHeight / 2 - 24) + 'px, 0px' +')'
                            break
                        case 'right-bottom':
                            popover.style.transform =  'translate3d(' + ( itemWidth + 20 ) + 'px, ' + (itemHeight/2-24-popoverHeight) + 'px, 0px' +')'
                            break
                        case 'left':
                            popover.style.transform =  'translate3d(' + (-20-popoverWeight) + 'px, ' + ((itemHeight-popoverHeight)/2) + 'px, 0px' +')'
                            break
                        case 'left-top':
                            popover.style.transform =  'translate3d(' + (-20-popoverWeight) + 'px, ' + (itemHeight / 2 - 24) + 'px, 0px' +')'
                            break
                        case 'left-bottom':
                            popover.style.transform =  'translate3d(' + (-20-popoverWeight) + 'px, ' + (itemHeight/2-24-popoverHeight) + 'px, 0px' +')'
                            break
                        case 'top':
                            popover.style.transform =  'translate3d(' + ((itemWidth-popoverWeight)/2) + 'px, ' + (-20-popoverHeight) + 'px, 0px' +')'
                            break
                        case 'top-right':
                            popover.style.transform =  'translate3d(' + ( 20 + itemWidth/2 - popoverWeight) + 'px, ' + (-20-popoverHeight) + 'px, 0px' +')'
                            break
                        case 'top-left':
                            popover.style.transform =  'translate3d(' + ((itemWidth/2 - 30)) + 'px, ' + (-20-popoverHeight) + 'px, 0px' +')'
                            break
                        case 'bottom':
                            popover.style.transform =  'translate3d(' + ((itemWidth-popoverWeight)/2) + 'px, ' + (itemHeight + 20) + 'px, 0px' +')'
                            break
                        case 'bottom-right':
                            popover.style.transform =  'translate3d(' + ( 20 + itemWidth/2 - popoverWeight) + 'px, ' + (itemHeight + 20) + 'px, 0px' +')'
                            break
                        case 'bottom-left':
                            popover.style.transform =  'translate3d(' + ((itemWidth/2 - 30)) + 'px, ' + (itemHeight + 20) + 'px, 0px' +')'
                            break
                        default:
                            break
                    }
                }`

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
            dismiss = "<span onclick={{action 'dismiss'}}>{{svg-jar 'cross' width='24px' height='24px' class='icon-pointer' }}</span>"
        }

        if (comp.attrs.link) {
            link = "<a href='" + comp.attrs.link.href + "'>" + comp.attrs.link.name + "</a>"
        }

        if (comp.attrs.actions === "true") {
            actions = "<button onclick={{action 'dismiss'}}>Cancel</button><button>Confirm</button>"
        }


        return  "<div class='popover-container'>" + "\r" +
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
                // "</div>"
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
