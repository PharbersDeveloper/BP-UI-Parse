"use strict"

import { CompExec } from "../../bashexec/compExec"
import { StatusExec } from "../../bashexec/widgets/status/statusExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPStatus extends BPWidget {
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

        return `{{${comp.name} ssc="ssc" emit="emit"
            disconnect="disconnect" ${attrsBody}}}`
        // return "{{#" + comp.name + "}}" + comp.text + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const {attrs, styleAttrs, events } = comp

        const attrsBody = attrs.map( (item: IAttrs) => {
            if (typeof item.value === "string") {
                return `${item.name}: '${item.value}',`
            } else {
                return  `${item.name}: ${item.value},`
            }
        })
        let styleAttrsBody = ""
        let classNameBindings = ""

        styleAttrs.forEach( (item: IAttrs) => {
            if (typeof item.value === "string") {
                styleAttrsBody += `${item.name}: '${item.value}',`
            } else {
                styleAttrsBody += `${item.name}: ${item.value},`
            }
            classNameBindings += `'${item.name}',`
        })

        const fileData = `
        import { computed } from '@ember/object';
        export default Component.extend({
            layout,
            tagName:'span',
            classNames:['${comp.name}'],
            classNameBindings: ['currentType', 'currentStyle'],
            attributeBindings: [''],
            ${attrsBody}
            ${styleAttrsBody}
            currentStyle: computed('subtle', function () {
                let isSubtle = this.get('subtle')
                if (isSubtle) {
                    return "status-subtle"
                } else {
                    return "status-bold"
                }
            }),
            currentType: computed('type', function () {
                let type = this.get('type');

                return "status-" + type
            }),
            ${this.slotActions(events, `${comp.name}`)}}, `

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `${leaf.paintShow()}
        {{#if hasBlock}}
            {{yield}}
        {{else}}
            {{statusContent}}
        {{/if}}`
     }
}
