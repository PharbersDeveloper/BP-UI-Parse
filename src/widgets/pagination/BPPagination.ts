"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
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
        const pageArray = [...Array(comp.attrs.pages)].map((it, i) => i + 1)

        const fileData = "\n" +
            "import {computed} from '@ember/object';" + "\r" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name +  "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" +
            "    curPage: 1," + "\r" +
            "    pageArray: [" + pageArray + "]," + "\r" +
            "    forEachArray: [" + pageArray + "]," + "\r" +
            "    changePageArray() { " + "\r" +
            "        // 1  折叠符...位置的改变" + "\r" +
            "        if (this.pageArray.length > 7) {" + "\r" +
            "            let newArr = []" + "\r" +
            "            // 首页始终显示" + "\r" +
            "            newArr.push(this.pageArray[0])" + "\r" +
            "            // 与尾页距离大于5，... 在后方显示" + "\r" +
            "            // 与首页距离大于5，... 在前方显示" + "\r" +
            "            // 与首页尾页距离大于5，使用双 ... " + "\r" +
            "            if (this.curPage < 5) {" + "\r" +
            "                for(let i = 2; i <= 5; i++) {" + "\r" +
            "                    newArr.push(i)" + "\r" +
            "                 }" + "\r" +
            "               newArr.push('...')" + "\r" +
            "            } else if ((this.pageArray.length - this.curPage) < 4) {" + "\r" +
            "                newArr.push('...')" + "\r" +
            "                for(let i = this.pageArray.length - 4; i <= this.pageArray.length - 1; i++) {" + "\r" +
            "                    newArr.push(i)" + "\r" +
            "                }" + "\r" +
            "            } else { " + "\r" +
            "                newArr.push('...')" + "\r" +
            "                newArr.push(this.curPage - 1)" + "\r" +
            "                newArr.push(this.curPage)" + "\r" +
            "                newArr.push(this.curPage + 1)" + "\r" +
            "                newArr.push('...')" + "\r" +
            "            }" + "\r" +
            "            // 尾页始终显示" + "\r" +
            "             newArr.push(this.pageArray[this.pageArray.length-1])" + "\r" +
            "             this.set('forEachArray', newArr)" + "\r" +
            "        }" + "\r" +
            "    }," + "\r" +
            "    didInsertElement() {" + "\r" +
            "        this._super(...arguments)" + "\r" +
            "        this.changePageArray()" + "\r" +
            "    }," + "\r" +
            "    actions: { " + "\r" +
            "        changePage(type, page) { " + "\r" +
            "            if (type === 'next') { " + "\r" +
            "                this.set('curPage', Math.min(this.curPage + 1, this.pageArray.length))" + "\r" +
            "                this.changePageArray()" + "\r" +
            "            } else if (type === 'pre') { " + "\r" +
            "                this.set('curPage',Math.max( this.curPage - 1, 1))" + "\r" +
            "                this.changePageArray()" + "\r" +
            "            } else { " + "\r" +
            "                let cur = Number(page)" + "\r" +
            "                if (!isNaN(cur)) {" + "\r" +
            "                    this.set('curPage', Number(page))" + "\r" +
            "                    this.changePageArray()" + "\r" +
            "                }" + "\r" +
            "            }" + "\r" +
            "        }," + "\r" +
            "    }"

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
