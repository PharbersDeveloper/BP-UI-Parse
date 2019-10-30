"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPCheckbox extends BPWidget {
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
        return "{{#" + comp.name + "}}" + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const checkboxId = comp.attrs.id
        const checkboxName = comp.attrs.name
        const checkboxCheck = comp.attrs.checked
        const checkboxDisable = comp.attrs.disabled
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        let fileData = "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'input'," + "\r" +
            "    classNames:['" + comp.name + "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['type', 'id', 'name', 'checked', 'disabled']," + "\r" +
            "    type: 'checkbox'," + "\r" +
            "    id: '" + checkboxId + "'," + "\r" +
            "    name: '" + checkboxName + "'," + "\r"

        if (checkboxCheck === "true") {
                fileData = fileData + "    checked: 'true',\r"
            }

        if (checkboxDisable === "true") {
                fileData = fileData + "    disabled: 'true',\r"
            }

        return fileDataStart + fileData + fileDataEnd
    }
}
