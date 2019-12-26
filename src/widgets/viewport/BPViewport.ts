"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import { GenCompList } from "../../bashexec/genCompList"
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
        const { attrs, styleAttrs } = comp
        // TODO  action / event / state
        const attrsBody = this.showProperties([...attrs, ...styleAttrs], comp)
        const insideComps = comp.components
        const compListClass = new GenCompList(this.output, this.projectName, this.routeName)
        const compList = compListClass.createList()
        // 判断attrs 中是否有 classNames ，如果没有，则使用 className 属性的值
        const isClassNames = attrs.some((attr: IAttrs) => attr.name === "classNames")
        const classNames: string = isClassNames ? "" : `classNames="${comp.className.split(",").join(" ")}"`
        let showBody: string = ""
        insideComps.forEach((icomp) => {
            const compIns = compList.find((x) => x.constructor.name === icomp.type)
            showBody += compIns.paintShow(icomp)
        })
        return `{{#${comp.name} ssc="ssc" emit="emit" disconnect="disconnect" ${classNames} ${attrsBody}}}
                    ${showBody}
                {{/${comp.name}}}`
    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const { attrs, styleAttrs, events } = comp
        // TODO  action / event / state

        const attrsBody = this.logicAttrs([...attrs, ...styleAttrs])
        let classNameBindings = ""
        styleAttrs.forEach((item: IAttrs) => {
            classNameBindings += `"${item.name}",`
        })
        const fileData = "\n" +
            `import { computed } from '@ember/object';
            export default Component.extend({
                layout,
                classNames:['${comp.name}','viewport-class'],
                content: 'default',
                attributeBindings: ['style', 'vid:id'],
                ${attrsBody}
                classNameBindings: [${classNameBindings}],
                style: computed('width', 'height', function() {
                    return 'height:' + this.get('height') + ';width:' + this.get('width') + ';'
                }),
                ${this.slotActions(events, `${comp.name}`)},
                    stepAction(dire) {
                        let curDom = document.getElementById(this.get('vid'))
                        let curSroll = curDom.getElementsByClassName("viewport-auto-wrapper")[0]
                        let curDistance = curSroll.scrollLeft
                        let step = this.get('step')
                        if(dire ==="right") {
                            curSroll.scrollLeft = step + curDistance
                        } else if (dire === "left") {
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
