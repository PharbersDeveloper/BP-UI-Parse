"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPSelectMultiple extends BPWidget {
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
            show: false,
            width: 320,
            classNames:['bp-input-downdrop'],
            attributeBindings: ['tabIndex'],
            dataArray: ["option 1", "option 2", "option 3", "option 4", "option 5", "option 6", "option 7", "option 8"],
            selectArr: [],
            tabIndex: '1',
            flagFirst: 0,
            inputId: "input-id",
            focusOut() {
            },
            focusIn() {
            },
            keyDown(event) {
                if (event.keyCode === 13) {
                  let input = this.get("inputValue"),
                    curArr = this.get("selectArr")
                    curArr.push(input)
                    this.set("show", false)
                    this.$("#" + this.get("inputId")).blur();

                    this.set("inputValue", "")
                  this.set("selectArr", [...new Set(curArr)])

                }
              },
            ${attrsBody}
            ${styleAttrsBody}
            actions: {
                close() {
                    this.set("show",false)
                    setTimeout(function() {
                      this.set("flagFirst", false)
                    }.bind(this),100)
                  },
                  show() {
                    this.set("show",true)
                  },
                  toggleShow() {
                    this.toggleProperty("flagFirst")
                    if (this.get("flagFirst")) {
                      this.$("#" + this.get("inputId")).focus();
                    } else {
                      this.$("#" + this.get("inputId")).blur();
                    }
                  },
                chooseItem(index) {
                    this.$("#" + this.get("inputId")).blur();
                    let arr = this.get("dataArray"),
                    curArr = this.get("selectArr")
                    curArr.push(arr[index])

                    this.set("show", false)
                    this.set("selectArr", [...new Set(curArr)])
                    // [...new Ser()] 的写法会让模版进行更新，curArr 不会
                    // 原因？
                    return false
                },
                deleteTag(item) {
                    let curArr = this.get("selectArr")
                    for(let i = 0; i < curArr.length; i++) {
                    if (curArr[i] === item) {
                        curArr.splice(i, 1)
                        i = i - 1
                    }
                    }
                    this.set("selectArr", [...new Set(curArr)])
                    this.set("show", false)

                    return false
                }
            }`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `
        <div class="bp-input input-tags" onclick={{action "toggleShow" bubbles=false}} style="width:{{width}}px;cursor: text;">
        {{#each selectArr as |item index|}}
            <span class="select-input-tag ">{{item}}
                <div onclick={{action "deleteTag" item bubbles=false}}>
                    {{svg-jar 'cross' width='12px' height='12px' class='cursor-pointer'}}
                </div>
            </span>
        {{/each}}
        <span>
            <span>{{inputValue}}</span>
            {{input value=inputValue class="select-multiple-input" id=inputId  focus-out="close" focus-in="show"}}
        </span>
    </div>

    {{#if show}}
        <div class="input-list-tags" style="width:{{width}}px;z-index:999;" tabindex="1">
            {{#each dataArray as |item index|}}
                <span onmousedown={{action "chooseItem" index bubbles=false}} class={{if (belong-to selectArr item) "input-list-tags-choosed-span" "input-list-tags-span"}} >{{item}}</span>
            {{/each}}
        </div>
    {{/if}}


        `
    }
}
