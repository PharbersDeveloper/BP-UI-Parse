"use strict"

import { CompExec } from "../../bashexec/compExec"
import { CompStylesRepaint } from "../../bashexec/compStylesRepaint"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions, IReStyleOpt } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPPushButton extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    // public paint(ctx: BPCtx, comp: BPComp, isShow: boolean) {
    //     const execList: any[] = []

    //     const options: IOptions = {
    //         comp,
    //         hbsData: this.paintHBS(),
    //         logicData: this.paintLogic(comp), // js
    //         output: this.output,
    //         pName: this.projectName,
    //         rName: this.routeName,
    //         showData: this.paintShow(comp), // hbs
    //         styleData: this.paintStyle(comp) //  继承自 BPWidget 的方法, css
    //     }
    //     execList.push(new CompExec(options, isShow))

    //     return execList
    // }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            hbsData: this.paintHBS(),
            logicData: this.paintLogic(comp),
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.paintStyle(comp)
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

        if (comp.icon) {
            return `{{#${comp.name}  ${classNames} ${attrsBody}  ssc="ssc" emit="emit" disconnect="disconnect" }}{{/${comp.name}}}`
        }
        return `{{#${comp.name}  ${classNames} ${attrsBody} ssc="ssc" emit="emit" disconnect="disconnect" }}{{/${comp.name}}}`
    }

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
            classNameBindings: ['block:btn-block','currentType', 'currentDensity'],
            attributeBindings: ['disabled:disabled'],
            block: false,
            ${attrsBody}
            ${styleAttrsBody}
            currentType: computed('type', function () {
                let type = this.get('type')
                if (type) {
                    return "button-" + type
                } else {
                    return 'button-primary'
                }
            }),
            currentDensity: computed('density', function () {
                let density = this.get('density')
                if (density) {
                    return "button-density-" + density
                } else {
                    return 'button-density-default'
                }
            }),
            ${this.slotActions(events, `${comp.name}`)}},`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `
        ${leaf.paintShow()}
        {{svg-jar icon width='24px' height='24px' class='icon button-icon-color'}}
        {{text}}
        {{yield}}`
    }
}
