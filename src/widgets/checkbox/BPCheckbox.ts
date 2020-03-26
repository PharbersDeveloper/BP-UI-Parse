"use strict"

// import { InputExec } from "../../bashexec/widgets/inputs/inputExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPCheckbox extends BPWidget {
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
        // 判断attrs 中是否有 classNames ，如果没有，则使用 className 属性的值
        const isClassNames = attrs.some((attr: IAttrs) => attr.name === "classNames")
        const classNames: string = isClassNames ? "" : `classNames="${comp.className.split(",").join(" ")}"`
        return `{{${comp.name} ${classNames} ${attrsBody}}}`
    }
    // public paintShow(comp: BPComp) {
    //     const { attrs, styleAttrs } = comp
    //     const attrsBody = [...attrs, ...styleAttrs].map((item: IAttrs) => {
    //         if (typeof item.value === "string") {
    //             return ` ${item.name}='${item.value}'`
    //         } else {
    //             return ` ${item.name}=${item.value}`
    //         }
    //     }).join("")

    //     return `{{${comp.name} ssc="ssc" emit="emit"
    //         disconnect="disconnect" ${attrsBody}}}`
    // }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法

        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const { attrs, styleAttrs, events } = comp

        const attrsBody = attrs.map((item: IAttrs) => {
            if (typeof item.value === "string") {
                return `${item.name}: '${item.value}',`
            } else {
                return `${item.name}: ${item.value},`
            }
        }).join("")
        let styleAttrsBody = ""
        let classNameBindings = ""

        styleAttrs.forEach((item: IAttrs) => {
            if (typeof item.type === "boolean") {
                styleAttrsBody += `${item.name}: ${item.value},`
            } else {
                styleAttrsBody += `${item.name}: '${item.value}',`
            }
            classNameBindings += `'${item.name}',`
        })

        const fileData = `
        import { computed } from '@ember/object';
        export default Component.extend({
            layout,
            tagName:'div',
            classNames:['${comp.name}'],
            content: 'default',
            classNameBindings: [],
            attributeBindings: ['disabled:disabled', 'type', 'value'],
            type: "checkbox",
            value: "text",
            id: "cid",
            ${attrsBody}
            ${styleAttrsBody}
            ${this.slotActions(events, `${comp.name}`)}},`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `${leaf.paintShow()}
        {{#if hasBlock}}
            {{yield}}
            {{#if disabled}}
                <input type="checkbox" id={{cid}} name={{name}} value={{value}} disabled>
            {{else}}
                <input type="checkbox" id={{cid}} name={{name}} value={{value}}>
            {{/if}}
            <label for={{cid}}>{{value}}</label>
        {{else}}
        {{#if disabled}}
            <input type="checkbox" id={{cid}} name={{name}} value={{value}} disabled>
        {{else}}
            <input type="checkbox" id={{cid}} name={{name}} value={{value}}>
        {{/if}}
        <label for={{cid}}>{{value}}</label>
        {{/if}}`
    }
}
