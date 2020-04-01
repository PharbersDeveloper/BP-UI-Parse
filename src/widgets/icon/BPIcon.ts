"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"
export default class BPIcon extends BPWidget {
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

        return `{{${comp.name} ssc="ssc" emit="emit" disconnect="disconnect" ${attrsBody} ${className}}}`
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const {attrs, styleAttrs, events, calcAttrs} = comp

        const attrsBody = attrs.map( (item: IAttrs) => {
            if (typeof item.value === "string") {
                return `${item.name}: '${item.value}',`
            } else {
                return  `${item.name}: ${item.value},`
            }
        })

        let styleAttrsBody = ""
        let calcAttrsBody  = ""

        styleAttrs.forEach( (item: IAttrs) => {
            if (typeof item.value === "string") {
                styleAttrsBody += `${item.name}: '${item.value}',`
            } else {
                styleAttrsBody += `${item.name}: ${item.value},`
            }
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
            classNameBindings: ['iconSmall:icon-small:'],`

        return fileDataStart + fileData + fileDataEnd

    }

    public paintHBS(comp: BPComp) {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        if (comp.events.length) {
            return `${leaf.paintShow()}
        {{svg-jar iconName width='24px' height='24px' class=color}}`
        } else {
            return `{{svg-jar iconName width='24px' height='24px' class=color}}`
        }

    }

}
