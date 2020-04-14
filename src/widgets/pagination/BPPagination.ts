"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPPagination extends BPWidget {
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

        const { attrs, styleAttrs, events } = comp

        // const attrsBody = attrs.map((item: IAttrs) => {
        //     if (typeof item.type === "boolean") {
        //         return `${item.name}: ${item.value},`
        //     } else {
        //         return `${item.name}: '${item.value}',`
        //     }
        // }).join("")

        // const pageArray = [...Array(comp.attrs.pages)].map((it, i) => i + 1)

        const fileData = "\n" +
            `import {computed} from '@ember/object';
            export default Component.extend({
                layout,
                tagName:'div',
                classNames:["${comp.name}"],
                content: 'default',
                classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only'],
                attributeBindings: [''],
                curPage: 1,
                pages: 12,
                pageArray: computed("pages", function() {
                    let p = this.get("pages")
                    return [...Array(p)].map((it, i) => i + 1)
                }),
                forEachArray: computed("pages", function() {
                    let p = this.get("pages")
                    return [...Array(p)].map((it, i) => i + 1)
                }),
                changePageArray() {
                    // 1  折叠符...位置的改变
                    if (this.pageArray.length > 7) {
                        let newArr = []
                        // 首页始终显示
                        newArr.push(this.pageArray[0])
                        // 与尾页距离大于5，... 在后方显示
                        // 与首页距离大于5，... 在前方显示
                        // 与首页尾页距离大于5，使用双 ...
                        if (this.curPage < 5) {
                            for(let i = 2; i <= 5; i++) {
                                newArr.push(i)
                             }
                           newArr.push('...')
                        } else if ((this.pageArray.length - this.curPage) < 4) {
                            newArr.push('...')
                            for(let i = this.pageArray.length - 4; i <= this.pageArray.length - 1; i++) {
                                newArr.push(i)
                            }
                        } else {
                            newArr.push('...')
                            newArr.push(this.curPage - 1)
                            newArr.push(this.curPage)
                            newArr.push(this.curPage + 1)
                            newArr.push('...')
                        }
                        // 尾页始终显示
                         newArr.push(this.pageArray[this.pageArray.length-1])
                         this.set('forEachArray', newArr)
                    }
                },
                didInsertElement() {
                    this._super(...arguments)
                    this.changePageArray()
                },
                actions: {
                    changePage(type, page) {
                        if (type === 'next') {
                            this.set('curPage', Math.min(this.curPage + 1, this.pageArray.length))
                            this.changePageArray()
                        } else if (type === 'pre') {
                            this.set('curPage',Math.max( this.curPage - 1, 1))
                            this.changePageArray()
                        } else {
                            let cur = Number(page)
                            if (!isNaN(cur)) {
                                this.set('curPage', Number(page))
                                this.changePageArray()
                            }
                        }
                        // curPage, 执行外部传进来的函数
                        let way = this.get("changePage")
                        way(this.get("curPage"))
                    },
                }`

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        const start = "<span onclick={{action 'changePage' 'pre'}} class={{if (eq curPage 1) 'pagination-unable' 'pagination-able'}}>{{svg-jar 'left' width='24px' height='24px' }}</span>"
        const end = "<span onclick={{action 'changePage' 'next'}} class={{if (eq curPage pageArray.length) 'pagination-unable' 'pagination-able'}}>{{svg-jar 'right' width='24px' height='24px' }}</span>"
        let pages = ""

        if (comp.attrs.type === "simple") {
            pages = "<div class='pagination-page pagination-active'>{{curPage}}</div>/ <div class='pagination-page'> {{pageArray.length}}</div>"
        } else {
            pages = "{{#each forEachArray as |page index|}}" + "\r" +
                    "<div onclick={{action 'changePage' '' page}} class={{if (eq curPage page) 'pagination-page pagination-active' 'pagination-page'}}>{{page}}</div>" + "\r" +
                    "{{/each}}"
        }

        return "<div class='pagination-container'>"  + "\r" +
            "<div class='pagination'>" + "\r" +
            start + "\r" +
            pages + "\r" +
            end + "\r" +
            "</div>" + "\r" +
            "</div>" + "\r"
    }

}
