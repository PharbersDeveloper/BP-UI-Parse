"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPCascader extends BPWidget {
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
            subShow: false,
            selectIcon: "down",
            choosedValue: 0,
            curItemIndex: 0, // 一级的item
            tabIndex: '1',
            attributeBindings: ['tabIndex'],
            positionalParams: ["selectItems", "subSelectItems","data", "subData"],
            focusOut() {
                this.set('show',false)
                this.set('subShow',false)
            },
            ${attrsBody}
            ${styleAttrsBody}
            actions: {
                toggleShow() {
                    if(!this.disabled) {
                        this.toggleProperty('show')
                        this.toggleProperty('subShow')
                        let subDataArr = this.get("subData")
                        this.set("curSubArea", subDataArr[0])
                    }
                },
                showSub(index) {
                    this.set("subShow", true)

                    let subDataArr = this.get("subData")
                    this.set("curSubArea", subDataArr[index])
                    this.set("curItemIndex", index)

                    console.log(11)
                    return false
                },
                addSubItem(item) {
                    let curItemIndex = this.get("curItemIndex"),
                    subSelectItemArr = this.get("subSelectItems"),
                    selectItemArr = this.get("selectItems"), // 被选中的一级item
                    curItem = this.get("data")[curItemIndex], // 二级 item 所属的一级item
                    curSubItem = item // 二级 item

                    // 二级item已存在，删除；不存在，则增加
                    if(subSelectItemArr[curItemIndex].includes(curSubItem)){
                        let i = subSelectItemArr[curItemIndex].indexOf(curSubItem)

                        subSelectItemArr[curItemIndex].splice(i, 1)
                    } else {
                        subSelectItemArr[curItemIndex].push(curSubItem)
                    }
                    this.set("subSelectItems", [...new Set(subSelectItemArr)])

                    // 所属一级item下，已有 len 个二级item
                    let len = subSelectItemArr[curItemIndex].length

                    // 所有二级item均被选中，则一级item也被选中
                    if ( len === this.get("subData")[curItemIndex].length ) {
                        selectItemArr.push(this.get("data")[curItemIndex])
                    } else {
                        // 二级item没有被全部选中，删除一级item
                        if ( selectItemArr.includes( curItem ) ) {
                            let selectItemArr = this.get("selectItems"),
                            i = this.get("selectItems").indexOf(curItem)

                            selectItemArr.splice(i, 1)
                        }
                    }
                    this.set("selectItems", [...new Set(selectItemArr)])
                    return false
                },
                addItem(item, index) {
                    let subDataArr = this.get("subData"),
                        selectItemArr = this.get("selectItems"),
                        subSelectItemArr = this.get("subSelectItems"),
                        curItemIndex = index

                    this.set("curSubArea", subDataArr[index])
                    this.set("curItemIndex", index)
                    if ( selectItemArr.includes( item ) ) {
                        let i = selectItemArr.indexOf(item),
                            arr = subSelectItemArr[curItemIndex]

                        selectItemArr.splice( i, 1 )
                        arr.splice( 0, arr.length )
                    } else {
                        let subDataRaw = subDataArr[curItemIndex]

                        selectItemArr.push(item)
                        for( let i = 0; i < subDataRaw.length; i++ ) {
                            subSelectItemArr[curItemIndex].push(subDataRaw[i])
                        }
                    }
                    this.set("subSelectItems", [...new Set(subSelectItemArr)])
                    this.set("selectItems", [...new Set(selectItemArr)])
                    return false
                }
            }`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `
        <div class='bp-cascader-title cross-center' {{action 'toggleShow'}}>
        <span class="select-tag">{{choosedValue}}</span>
        {{svg-jar selectIcon width='24px' height='24px' class=iconClass}}
        </div>

        <ul class={{if show 'cascader-list' 'd-none'}}>
        {{#each data as |city index|}}
            <div class={{if (eq index curItemIndex) "flex-row main-space-between cascader-list-item cascader-list-item-active" "flex-row main-space-between cascader-list-item"}} >
                <div onclick={{action "addItem" city index }} class="flex-1">
                    {{#if (belong-to selectItems city)}}
                    <input type="checkbox" id={{city}} name="list" value={{city}} checked>
                    {{else if (some-belong-to subData subSelectItems index)}}
                    <input type="checkbox" id={{city}} name="list" value={{city}} class="some-checked-checkbox">
                    {{else}}
                    <input type="checkbox" id={{city}} name="list" value={{city}} >
                    {{/if}}
                    <label for={{city}} >{{city}}</label>
                </div>
                <span onclick={{action "showSub" index}}>
                    {{svg-jar  "down" width='24px' height='24px' class="downRight"}}
                </span>
            </div>
        {{/each}}
        </ul>

        <ul class={{if subShow 'subSelect' 'd-none'}}>
        {{#each curSubArea as |city index|}}
            <div class="flex-row cascader-list-item" onclick={{action "addSubItem" city}}>
                {{#if (belong-to subSelectItems city)}}
                    <input type="checkbox" id={{city}} name="list" value={{city}} checked>
                {{else}}
                    <input type="checkbox" id={{city}} name="list" value={{city}}>
                {{/if}}
                    <label for={{city}} class="flex-1">{{city}}</label>
            </div>
        {{/each}}
        </ul>
        `
    }
}
