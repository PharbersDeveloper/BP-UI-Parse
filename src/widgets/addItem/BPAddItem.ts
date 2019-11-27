"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPAddItem extends BPWidget {
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
                classNames:[],
                content: 'default',
                classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only'],
                attributeBindings: [],
                actions: {
                    addItem(event) {
                        const ev = event || window.event
                        const positon = ev.target.parentNode
                        const main = positon.previousSibling
                        const outer = positon.parentNode
                        const newElem = main.cloneNode('deep')
                        outer.insertBefore(newElem, positon);
                    },
                    delete(event) {
                        const ev = event || window.event
                        const allInput = document.getElementsByClassName('add-item-main')
                        window.console.log(allInput.length)
                        if (allInput.length > 1) {

                            let target = ev.target
                            while(!target.classList.contains('add-item-main')) {
                                target = target.parentNode
                            }
                            target.parentNode.removeChild(target)
                        }
                    },`

        fileData = fileData  + "}"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        return `<label class='add-item-label'>Field label</label>
        <label class='add-item-desc'>Help or instruction text goes here</label>
        <div class='flex-direction-row add-item-main'>
            <input class="add-item-input">
            <span {{action 'delete'}} class='add-item-cross-icon cursor-pointer'>{{svg-jar 'cross' width='24px' height='24px' class='' }}</span>
        </div><div class='flex-direction-row' {{action 'addItem'}} class='add-item-footer'>
            {{svg-jar 'add' width='24px' height='24px' class='add-item-add-icon cursor-pointer' }}
            <label class='add-item-text cursor-pointer'>添加项目</label>
        </div>`
        // 防止拿到兄弟节点的时候遇到空白节点，不要回车换行
    }

}
