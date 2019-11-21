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
        const nextStep = comp.attrs.text.length > 1 ? true : false
        let textContent = "["
        comp.attrs.text.forEach((it: string) => {
            textContent += "'" + it + "',"
        })
        textContent = textContent.substring(0, textContent.length - 1)
        textContent += "]"

        let fileData = "\n" +
            `export default Component.extend({
                layout,
                tagName:'div',
                classNames:[''],
                curText: 0,
                showCcurText: 1,
                nextStep: ${nextStep},
                classNames: ['${comp.name}'],
                content: 'default',
                classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only'],
                attributeBindings: [''],
                popoverPlace: '${ comp.attrs.placement}',
                showSpotlightFlag: true,
                textContent: ${textContent},
                showSpotlight(flag) {
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
                    if (!flag) {
                        spotlight.style.display = "none"
                        needSpotlightItem.classList.remove("spotlight-item")
                    }
                },
                didInsertElement() {
                    this._super(...arguments);

                    this.showSpotlight(this.showSpotlightFlag)
                    if(this.curText === this.textContent.length - 1)  {
                        this.set("nextStep", false)
                    }
                },
                actions: {`

        fileData = fileData + "\r" +
            `dismissSpotlight(event) {
                let ev = event || window.event
                let curSpotlight = ev.target.parentNode.parentNode
                let item = curSpotlight.parentNode.previousElementSibling
                item.classList.remove("spotlight-item")
                curSpotlight.style.display = "none"
            },
            nextSTep() {
                this.set("curText", Math.min(this.curText + 1, this.textContent.length - 1))
                this.set("showCcurText", Math.min(this.showCcurText + 1, this.textContent.length))
                if(this.curText === this.textContent.length - 1)  {
                    this.set("nextStep", false)
                }
            }`

        fileData = fileData  + "}"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        const secondaryButton = comp.attrs.secondaryButton === "true" ?
        "<button {{action 'dismissSpotlight'}} class='secondary-btn'> 跳过 </button>" : ""

        const title = comp.attrs.title ? `<h3>${comp.attrs.title}</h3>` : ""

        return  `<div class="spotlight">
        ${title}
        <p>{{get textContent curText}}</p>
            <div>
                {{#if (gt textContent.length 1)}}
                <span>{{showCcurText}}/{{textContent.length}}</span>
                {{/if}}
                ${secondaryButton}
                {{#if nextStep}}
                <button {{action 'nextSTep'}}> 下一步 </button>
                {{else}}
                <button {{action 'dismissSpotlight'}}> Got it </button>
                {{/if}}
            </div>
        </div>`
    }
}
