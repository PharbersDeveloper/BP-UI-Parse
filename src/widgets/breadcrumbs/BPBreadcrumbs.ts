"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPBreadcrumbs extends BPWidget {
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
        let contentArray = "["
        comp.attrs.contents.forEach((it: string) => {
            contentArray += "'" + it + "',"
        })
        contentArray.substring(0, contentArray.length - 1)
        contentArray += "]"

        const fileData = "\n" +
            "import {computed} from '@ember/object';" + "\r" +
            "import { A } from '@ember/array';" + "\r" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name +  "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" +
            "    contents: " + contentArray + "," + "\r" +
            "    contentsArray: computed('this.contents', function() { " + "\r" +
            "        let arr = this.contents" + "\r" +
            "        let objArr = []" + "\r" +
            "        arr.forEach(it => { " + "\r" +
            "            let o = {}" + "\r" +
            "            o.name = it" + "\r" +
            "            o.href = 'index'" + "\r" +
            "            objArr.push(o)" + "\r" +
            "        })" + "\r" +
            "        return A(objArr)" + "\r" +
            "    })," + "\r" +
            "    showAll: false," + "\r" +
            "    actions: { " + "\r" +
            "        toggleShowAll() { " + "\r" +
            "            this.toggleProperty('showAll')" + "\r" +
            "        }," + "\r" +
            "    }," + "\r"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        let content = ""
        let contentAll = ""
        let contentPart = ""
        const arrayContent = comp.attrs.contents
        const len = arrayContent.length

        contentPart = "<div>{{#link-to content.href}}{{contentsArray.firstObject.name}}{{/link-to}}</div>"
        contentPart += "<span>/</span>" +
                    "<span onclick={{action 'toggleShowAll'}} class='breadcrumbs-show'>...</span>" +
                    "<span>/</span>"
        contentPart += "<div>{{#link-to content.href}}{{contentsArray.lastObject.name}}{{/link-to}}</div>"

        contentAll = "{{#each contentsArray as |content|}}" + "\r" +
                    "    <div> {{#link-to content.href}}{{content.name}} {{/link-to}}</div>" + "\r" +
                    "    {{#if (not-eq content.name contentsArray.lastObject.name)}}" + "\r" +
                    "        <span>/</span>" + "\r" +
                    "    {{/if}}" + "\r" +
                    "{{/each}}"

        content = "{{#if showAll}}" + "\r" +
                contentAll + "\r" +
                "{{else}}" + "\r" +
                contentPart + "\r" +
                "{{/if}}" + "\r"

        return "<div class='breadcrumbs-container'>" + "\r" +
        content + "\r"  +
        "</div>"
    }
}
