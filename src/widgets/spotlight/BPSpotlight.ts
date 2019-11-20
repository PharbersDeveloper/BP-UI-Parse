"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPSpotlight extends BPWidget {
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
            `export default Component.extend({
                layout,
                tagName:'div',
                classNames:[''],
                classNames:['${comp.name}'],
                content: 'default',
                classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only'],
                attributeBindings: [''],
                popoverPlace: '${ comp.attrs.placement}',
                didInsertElement() {
                    this._super(...arguments);

                    const element = Array.from(document.getElementsByClassName("${comp.name}"))[0]
                    const needSpotlightItem = element.previousElementSibling
                    const spotlight = element.childNodes[0]
                    const eleHeight = needSpotlightItem.offsetHeight
                    const eleWidth = needSpotlightItem.offsetWidth
                    const spotHeight = spotlight.offsetHeight
                    const spotWidth = spotlight.offsetWidth
                    const spotPlace = "${comp.attrs.placement}"

                    switch(spotPlace) {
                        case 'right':
                            spotlight.style.transform =  'translate3d(' + ( eleWidth + 15 ) + 'px, ' + ((eleHeight-spotHeight) / 2) + 'px, 0px' +')'
                            break
                        case 'right-top':
                            spotlight.style.transform =  'translate3d(' + ( eleWidth + 15 ) + 'px, 0px, 0px' +')'
                            break
                        case 'right-bottom':
                            spotlight.style.transform =  'translate3d(' + ( eleWidth + 15 ) + 'px, ' + (eleHeight-spotHeight) + 'px, 0px' +')'
                            break
                        case 'left':
                            spotlight.style.transform =  'translate3d(' + (-15-spotWidth) + 'px, ' + ((eleHeight-spotHeight) / 2) + 'px, 0px' +')'
                            break
                        case 'left-top':
                            spotlight.style.transform =  'translate3d(' + (-15-spotWidth) + 'px, 0px, 0px' +')'
                            break
                        case 'left-bottom':
                            spotlight.style.transform =  'translate3d(' + (-15-spotWidth) + 'px, ' + (eleHeight-spotHeight) + 'px, 0px' +')'
                            break
                        case 'top':
                            spotlight.style.transform =  'translate3d(' +((eleWidth-spotWidth)/2)+ 'px, ' + (-15-spotHeight) + 'px, 0px' +')'
                            break
                        case 'top-right':
                            spotlight.style.transform =  'translate3d(' + (eleWidth-spotWidth) + 'px, ' + (-15-spotHeight) + 'px, 0px' +')'
                            break
                        case 'top-left':
                            spotlight.style.transform =  'translate3d( 0px, ' + (-15-spotHeight) + 'px, 0px' +')'
                            break
                        case 'bottom':
                            spotlight.style.transform =  'translate3d(' +((eleWidth-spotWidth)/2)+ 'px, ' + (eleHeight + 15) + 'px, 0px' +')'
                            break
                        case 'bottom-right':
                            spotlight.style.transform =  'translate3d(' + (eleWidth-spotWidth) + 'px, ' + (eleHeight + 15) + 'px, 0px' +')'
                            break
                        case 'bottom-left':
                            spotlight.style.transform =  'translate3d( 0px, ' + (eleHeight + 15) + 'px, 0px' +')'
                            break
                        default:
                            break
                    }
                },
                actions: {`

        fileData = fileData + "\r" +
            `dismissSpotlight(event) {
                let arr = Array.from(document.getElementsByClassName("spotlight-item"))
                arr[0].classList.remove("spotlight-item")
                arr[0].nextElementSibling.style.display = "none"
            },`

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
                "            popover.style.transform =  'translate3d(' + ( btnWidth + 20 ) + 'px, ' + ((btnHeight-popoverHeight) / 2) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'right-top':" + "\r" +
                "            popover.style.transform =  'translate3d(' + ( btnWidth + 20 ) + 'px, ' + (btnHeight / 2 - 24) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'right-bottom':" + "\r" +
                "            popover.style.transform =  'translate3d(' + ( btnWidth + 20 ) + 'px, ' + (btnHeight/2-24-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'left':" + "\r" +
                "            popover.style.transform =  'translate3d(' + (-20-popoverWeight) + 'px, ' + ((btnHeight-popoverHeight)/2) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'left-top':" + "\r" +
                "            popover.style.transform =  'translate3d(' + (-20-popoverWeight) + 'px, ' + (btnHeight / 2 - 24) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'left-bottom':" + "\r" +
                "            popover.style.transform =  'translate3d(' + (-20-popoverWeight) + 'px, ' + (btnHeight/2-24-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'top':" + "\r" +
                "            popover.style.transform =  'translate3d(' + ((btnWidth-popoverWeight)/2) + 'px, ' + (-20-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'top-right':" + "\r" +
                "            popover.style.transform =  'translate3d(' + ( 20 + btnWidth/2 - popoverWeight) + 'px, ' + (-20-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'top-left':" + "\r" +
                "            popover.style.transform =  'translate3d(' + ((btnWidth/2 - 30)) + 'px, ' + (-20-popoverHeight) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'bottom':" + "\r" +
                "            popover.style.transform =  'translate3d(' + ((btnWidth-popoverWeight)/2) + 'px, ' + (btnHeight + 20) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'bottom-right':" + "\r" +
                "            popover.style.transform =  'translate3d(' + ( 20 + btnWidth/2 - popoverWeight) + 'px, ' + (btnHeight + 20) + 'px, 0px' +')'" + "\r" +
                "            break" + "\r" +
                "        case 'bottom-left':" + "\r" +
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
        return  `<div class="spotlight">
        <p>${comp.attrs.text}</p>
            <div>
                <button {{action 'dismissSpotlight'}}> Got it </button>
            </div>
        </div>`
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
