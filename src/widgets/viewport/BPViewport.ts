"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPViewport extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
            super(output, name, routeName)
        }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean) {
        const execList: any[] = []

        const options: IOptions = {
                comp,
                hbsData: this.paintHBS(),
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
        const {attrs, styleAttrs} = comp
        const attrsBody = [...attrs, ...styleAttrs].map( (item: IAttrs) => {

            if (typeof item.value === "string") {
                return ` ${item.name}='${item.value}'`
            } else {
                return  ` ${item.name}=${item.value}`
            }

        }).join("")

        return `{{#${comp.name} ssc="ssc" emit="emit" disconnect="disconnect" ${attrsBody}}}

        {{/${comp.name}}}`
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const radioFor = comp.attrs.for
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const {attrs, styleAttrs, events, calcAttrs} = comp

        // map 返回数组，在用${}时候会导致多一个逗号
        const attrsBody = attrs.map( (item: IAttrs) => {
            if (typeof item.value === "string") {
                return `${item.name}: '${item.value}',\n`
            } else {
                return  `${item.name}: ${item.value},\n`
            }
        }).join("")

        // const attrsBody = ""
        let styleAttrsBody = ""
        let calcAttrsBody = ""

        styleAttrs.forEach( (item: IAttrs) => {
            if (typeof item.value === "string") {
                styleAttrsBody += `${item.name}: '${item.value}',\n`
            } else {
                styleAttrsBody += `${item.name}: ${item.value},\n`
            }
        })

        calcAttrs.forEach( (item: IAttrs) => {
            calcAttrsBody += `${item.name}: ${item.value},\n`
        })

        const fileData = `
        import { computed } from '@ember/object';
        export default Component.extend({
            layout,
            tagName:'div',
            classNames:['${comp.name}','viewport-class'],
            content: 'default',
            attributeBindings: ['style', 'vid:id'],
            ${attrsBody}
            ${styleAttrsBody}
            ${calcAttrsBody}
            classNameBindings: [],
            style: computed('width', 'height', function() {
                return 'height:' + this.get('height') + ';width:' + this.get('width') + ';'
            }),
            actions: {
                stepAction(dire) {
                    let curDom = document.getElementById(this.get('vid'))
                    let curSroll = curDom.getElementsByClassName("viewport-auto-wrapper")[0]
                    let curDistance = curSroll.scrollLeft
                    let step = this.get('step')
                    window.console.log(11)
                    if(dire ==="right") {
                        curSroll.scrollLeft = step + curDistance
                    }else if (dire === "left") {
                        curSroll.scrollLeft = curDistance - step
                    }
                }
            }`

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `${leaf.paintShow()}
        {{#if clickChange}}
            <div onclick={{action "stepAction" "left"}} class='viewport-click-left'>{{svg-jar 'pre-year' width='24px' height='24px' class='icon-no-margin'}}</div>
        {{/if}}
        <div class="viewport-hidden-wrapper">
            <div class="viewport-auto-wrapper">
                <div style="width:2000px;" class="viewport-nowarp">
                    {{yield}}
                </div>
            </div>
        </div>
        {{#if clickChange}}
            <div onclick={{action "stepAction" "right"}} class='viewport-click-right'>{{svg-jar 'next-year' width='24px' height='24px' class='icon-no-margin'}}</div>
        {{/if}}`
    }
}
