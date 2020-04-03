"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import { GenCompList } from "../../bashexec/genCompList"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPViewport extends BPWidget {
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
        const insideComps = comp.components
        const compListClass = new GenCompList(this.output, this.projectName, this.routeName)
        const compList = compListClass.createList()
        // 判断attrs 中是否有 classNames ，如果没有，则使用 className 属性的值
        const isClassNames = attrs.some((attr: IAttrs) => attr.name === "classNames")
        const classNames: string = isClassNames ? "" : `classNames="${comp.className.split(",").join(" ")}"`
        let showBody: string = ""
        insideComps.forEach((icomp) => {
            const compIns = compList.find((x) => x.constructor.name === icomp.type)
            showBody += compIns.paintShow(icomp)
        })
        return `{{#${comp.name} ssc="ssc" emit="emit" disconnect="disconnect" ${classNames} ${attrsBody}}}
                    ${showBody}
                {{/${comp.name}}}`
    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const { attrs, styleAttrs, events } = comp
        // TODO  action / event / state

        const attrsBody = this.logicAttrs([...attrs, ...styleAttrs])
        let classNameBindings = ""
        styleAttrs.forEach((item: IAttrs) => {
            classNameBindings += `"${item.name}",`
        })
        const fileData = "\n" +
            `import { computed } from '@ember/object';
            export default Component.extend({
                layout,
                classNames:['${comp.name}','viewport-class'],
                content: 'default',
                attributeBindings: ['style', 'vid:id'],
                ${attrsBody}
                classNameBindings: [${classNameBindings}],
                style: computed('width', 'height', function() {
                    return 'height:' + this.get('height') + ';width:' + this.get('width') + ';'
                }),
                sidebarIconStyleRight: computed('sidebarIconStyle', function(){
                    if (this.get('sidebarIconStyle')) {
                        return this.get('sidebarIconStyle') + '-right'
                    }
                }),
                sidebarIconStyleLeft: computed('sidebarIconStyle', function(){
                    if (this.get('sidebarIconStyle')) {
                        return this.get('sidebarIconStyle') + '-left'
                    }
                }),
                ${this.slotActions(events, `${comp.name}`)},
                    stepAction(dire) {
                        let curVireport = document.getElementById(this.get('vid'))
                        let curDom = curVireport.getElementsByClassName("transform-list")[0]
                        let step = Number(this.get('step')),
                        curStep = 0,
                        dis = 0

                        if ( curDom.style.transform ) {
                            let curStepString = curDom.style.transform ? curDom.style.transform : "",
                                match = curStepString.match(/translateX\((.*)px\)/)

                            curStep = Number(match && match[1])
                        }

                        if(dire === "right") {
                            dis = curStep + step
                        } else if (dire === "left") {
                            dis = curStep - step
                        }
                        curDom.style.transform = "translateX(" + dis + "px)"
                    }
                }`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `${leaf.paintShow()}
        {{#if clickChange}}
            {{#if sidebarIcon}}
            <div onclick={{action "stepAction" "left"}} class={{sidebarIconStyleLeft}}>{{svg-jar sidebarIcon width='24px' height='24px' class='icon-no-margin'}}</div>
            {{else}}
            <div onclick={{action "stepAction" "left"}} class='viewport-click-left'>{{svg-jar 'pre-year' width='24px' height='24px' class='icon-no-margin'}}</div>
            {{/if}}
        {{/if}}
        {{yield}}
        {{#if clickChange}}
            {{#if sidebarIcon}}
            <div onclick={{action "stepAction" "right"}} class={{sidebarIconStyleRight}}>{{svg-jar sidebarIcon width='24px' height='24px' class=icon-no-margin}}</div>
            {{else}}
            <div onclick={{action "stepAction" "right"}} class='viewport-click-right'>{{svg-jar 'next-year' width='24px' height='24px' class='icon-no-margin'}}</div>
            {{/if}}
        {{/if}}`
    }
}
