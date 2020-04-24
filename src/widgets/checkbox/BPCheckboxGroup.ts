"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"
import BPCheckbox from "./BPCheckbox"

export default class BPCheckboxGroup extends BPWidget {
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
        const {choosedValue} = comp.attrs
        const cVal: string = choosedValue ? choosedValue : "请选择"
        const classNames: string = isClassNames ? "" : `classNames="${comp.className.split(",").join(" ")}"`
        const menuItem = new BPCheckbox(this.output, this.projectName, this.routeName)
        const iComps = comp.components
        let showBody = ""

        iComps.forEach((item) => {
            showBody += menuItem.paintShow(item) + "\r\n"
        })

        return `{{#${comp.name} ${classNames} ${attrsBody} choosedValue='${cVal}' as |s| }}${showBody}{{/${comp.name}}}`
    }

    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法

        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const { attrs, styleAttrs, events } = comp

        const attrsBody = attrs.map((item: IAttrs) => {
            if (typeof item.type === "boolean") {
                return `${item.name}: ${item.value},`
            } else {
                return `${item.name}: '${item.value}',`
            }
        }).join("")
        let styleAttrsBody = ""
        let classNameBindings = ""

        styleAttrs.forEach((item: IAttrs) => {
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
            tagName:'div',
            classNames:['${comp.name}'],
            content: 'default',
            classNameBindings: [],
            choosedValue: [],
            onChange() { },
            ${attrsBody}
            ${styleAttrsBody}
            actions: {
                change(value) {
                    let arr = this.get("choosedValue")
                    if (arr.includes(value)) {
                      let index = arr.indexOf(value)
                      arr.splice(index, 1)
                    } else {
                      arr.push(value)
                      this.set('choosedValue',[...new Set(arr)]);
                    }
                    this.onChange(value)
                    console.log(this.get("choosedValue"))
                 }
            },`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `{{yield (hash  onChange=(action 'change')   val=choosedValue)}}`
    }
}
