"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPLabel from "../label/BPLabel"
import BPSlot from "../slotleaf/BPSlot"
import BPTag from "../tags/BPTag"

export default class BPDiv extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
  }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            hbsData: this.paintHBS(comp),
            logicData: this.paintLogic(comp),
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.paintStyle(comp) //  继承自 BPWidget 的方法
        }
        execList.push(new CompExec(options, isShow))

        return execList
    }

    public paintShow(comp: BPComp) {
        const insideComps = comp.components

        if (insideComps.length !== 0) {

            let showBody = ""
            insideComps.forEach((icomp) => {
                // 这个判断不对 暂时这样写一些
                // 理论上应该去找其特定的 type 然后调用paintShow函数，或者用其他方法实现嵌套
                if (icomp.type === "BPTag") {
                    const innerItem = new BPTag(this.output, this.projectName, this.routeName)
                    showBody += innerItem.paintShow(icomp) + "\n"
                } else if (icomp.type === "BPLabel") {
                    const innerItem = new BPLabel(this.output, this.projectName, this.routeName)
                    showBody += innerItem.paintShow(icomp) + "\n"
                } else {
                    showBody += this.paintShow(icomp) + "\n"
                }

            })

            const {attrs, styleAttrs} = comp
            const attrsBody = [...attrs, ...styleAttrs].map( (item: IAttrs) => {
                // return  ` ${item.name}=${item.value}`
                if (typeof item.value === "string") {
                    return ` ${item.name}='${item.value}'`
                } else {
                    return  ` ${item.name}=${item.value}`
                }

            }).join("")
            return `{{#${comp.name} ${attrsBody}}}${showBody}{{/${comp.name}}}`
        } else {
            const {attrs, styleAttrs} = comp
            const attrsBody = [...attrs, ...styleAttrs].map( (item: IAttrs) => {
                // return  ` ${item.name}=${item.value}`
                if (typeof item.value === "string") {
                    return ` ${item.name}='${item.value}'`
                } else {
                    return  ` ${item.name}=${item.value}`
                }

            }).join("")

            return  `{{#${comp.name} ssc="ssc" emit="emit" disconnect="disconnect" ${attrsBody}}}${comp.text}{{/${comp.name}}}`
        }
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const {attrs, styleAttrs, events, calcAttrs } = comp

        const attrsBody = attrs.map( (item: IAttrs) => {
            if (typeof item.value === "string") {
                return `${item.name}: '${item.value}',`
            } else {
                return  `${item.name}: ${item.value},`
            }
        })

        let styleAttrsBody = ""
        let classBinding = ""
        let calcAttrsBody = ""

        styleAttrs.forEach( (item: IAttrs) => {
            if (typeof item.value === "string") {
                styleAttrsBody += `${item.name}: '${item.value}',`
            } else {
                styleAttrsBody += `${item.name}: ${item.value},`
            }
            classBinding += `'${item.name}:${item.value}',`
        })

        calcAttrs.forEach( (item: IAttrs) => {
            calcAttrsBody += `${item.name}: ${item.value},`
        })

        const fileData = `
        import { computed } from '@ember/object';
        export default Component.extend({
            layout,
            tagName:'div',
            classNames:['${comp.name}'],
            content: 'default',
            attributeBindings: [''],
            ${attrsBody}
            ${styleAttrsBody}
            ${calcAttrsBody}
            classNameBindings: ['style',${classBinding}],`

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        if (comp.events.length) {
            return `${leaf.paintShow()}
        {{yield}}`
        } else {
            return `{{yield}}`
        }

    }
}
