"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPDateSelect extends BPWidget {
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
            start: 2000,
            end: 2020,
            show: false,
            type: "year",
            classNames:['bp-input-downdrop'],
            attributeBindings: ['tabIndex'],
            inputListType: computed("type", function () {
                return "input-list-container-"  + this.get("type")
                // type 目前有 month 和 year
            }),
            array: computed("start", "end", function() {
                let s = Number(this.get("start")),
                e = Number(this.get("end")),
                a = []

                for(let i = s; i <= e; i++) {
                a.push(i)
                }
                return a
            }),
            value: "2020",
            tabIndex: '1',
            focusOut() {
                this.set('show',false)
                window.console.log("1")
            },
            ${attrsBody}
            ${styleAttrsBody}
            actions: {
                toggleShow() {
                    // this.set("show", true)
                    this.toggleProperty("show")
                  },
                  chooseItem(index) {
                    let a = this.get("array")
                    this.set("value", a[index])
                    this.set("show", false)

                    return false
                  }
            }`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `
        <div class="input-list-container {{inputListType}}">
        <div class="bp-input select-input" {{action "toggleShow"}} >{{value}}</div>
        {{#if show}}
            <div class="input-list">
                {{#each array as |item index|}}
                    <span onclick={{action "chooseItem" index bubbles=false}} class="cursor-pointer">{{item}}</span>
                {{/each}}
            </div>
        {{/if}}
        </div>

        `
    }
}
