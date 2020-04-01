"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPLink extends BPWidget {
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

        const isClassNames = attrs.some((attr: IAttrs) => attr.name === "classNames")
        const className = isClassNames ? "" : `classNames="${comp.className.split(",").join(" ")}"`

        return `{{${comp.name}
        ssc="ssc"
        emit="emit"
        disconnect="disconnect"
        ${attrsBody}
        ${className}}}`
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const href = comp.attrs.href
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const {attrs, styleAttrs, events } = comp

        const attrsBody = attrs.map( (item: IAttrs) => {
            if (typeof item.value === "string") {
                return `${item.name}: '${item.value}',`
            } else {
                return  `${item.name}: ${item.value},`
            }
        }).join("")
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
            tagName:'button',
            classNames:['${comp.name}'],
            content: 'default',
            classNameBindings: ['currentType'],
            attributeBindings: ['disabled:disabled'],
            ${attrsBody}
            currentType: computed('type', 'disabled', function () {
                let disabled = this.get('disabled')

                if (disabled) {
                    return 'link-disabled'
                } else {

                    let type = this.get('type') ? this.get('type') : 'default';

                    return 'link-' + type
                }
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
            {{name}}
        {{/if}}`
     }
}
