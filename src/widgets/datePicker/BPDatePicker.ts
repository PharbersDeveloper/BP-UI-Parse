"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPDatePicker extends BPWidget {
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
        return "{{#" + comp.name + "}}" + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const range = comp.attrs.range

        let fileData = "\n" +
            `export default Component.extend({
                layout,
                tagName:'div',
                classNames:['positon-relative', 'width-fit-content'],
                content: 'default',
                classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only'],
                attributeBindings: [],
                date: "",
                didInsertElement() {
                    // const today = ""
                    laydate.render({
                        elem: "#${comp.name}", //指定元素
                        range: ${range},
                        theme: "gray",
                        showBottom: false,
                        mark: {
                            //today: "今", // 无效，在 laydate.js 方法中计算得出了规定的日期
                        }
                    });
                },
                actions: {`

        fileData = fileData  + "}"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        return `<Input id="${comp.name}" class="${comp.name}" @value={{mut date}} />
        {{svg-jar 'calendar' width='24px' height='24px' class='date-picker-icon' }}`
    }

}
