"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPBadge extends BPWidget {
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
            return  ` ${item.name}=${item.value}`
        }).join("")

        return `{{${comp.name} ssc="ssc" emit="emit"
            disconnect="disconnect" ${attrsBody}}}`
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const {attrs, styleAttrs, events } = comp

        // const events: string[] = comp.events["click", "mouseEnter", "mouseLeave"]
        const attrsBody = attrs.map( (item: IAttrs) => {
            return  `${item.name}: ${item.value},`
        })
        let styleAttrsBody = ""
        let classNameBindings = ""

        styleAttrs.forEach( (item: IAttrs) => {
            styleAttrsBody += `${item.name}: ${item.value},`
            classNameBindings += `'${item.name}',`
        })

        const fileData = "\n" +
        `import { computed } from '@ember/object';
        export default Component.extend({
            layout,
            tagName:'span',
            classNames:['${comp.name}'],
            result: computed("badgeNumber",function() {
                let num = this.badgeNumber || 0
                return num < 100 ?num: '99+'
            }),
            ${attrsBody}
            ${styleAttrsBody}
            classNameBindings: [${classNameBindings}],
            ${this.slotActions(events, `${comp.name}`)}},`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `${leaf.paintShow()}
        {{#if hasBlock}}
            {{yield}}
        {{else}}
            {{result}}
        {{/if}}`
    }
}
