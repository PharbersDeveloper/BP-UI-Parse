"use strict"

// import { InputExec } from "../../bashexec/widgets/inputs/inputExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPImg extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean) {
        const execList: any[] = []

        const options: IOptions = {
                comp,
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
        // TODO  action / event / state
        const attrsBody = this.showProperties([...attrs, ...styleAttrs], comp)
        // 判断attrs 中是否有 classNames ，如果没有，则使用 className 属性的值
        const isClassNames = attrs.some((attr: IAttrs) => attr.name === "classNames")
        const classNames: string = isClassNames ? "" : `classNames="${comp.className.split(",").join(" ")}"`
        return `{{${comp.name} ${classNames} ${attrsBody}}}`
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = `
        export default Component.extend({
            layout,
            tagName:'img',
            classNames:['${comp.name}'],
            classNameBindings: [],
            attributeBindings: ['src','alt'],`

        return fileDataStart + fileData + fileDataEnd
    }
    // public paintHBS() {
    //     const leaf = new BPSlot(this.output, this.projectName, this.routeName)

    //     return `${leaf.paintShow()}{{yield}}`
    //  }
}
