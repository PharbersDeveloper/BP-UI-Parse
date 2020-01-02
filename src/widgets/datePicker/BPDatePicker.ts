"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
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
        const {attrs, styleAttrs} = comp
        const attrsBody = [...attrs, ...styleAttrs].map( (item: IAttrs) => {
            if (typeof item.value === "string") {
                return ` ${item.name}='${item.value}'`
            } else {
                return  ` ${item.name}=${item.value}`
            }
        }).join("")
        return `{{${comp.name} ${attrsBody}}}`
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const {attrs, styleAttrs } = comp

        const attrsBody = attrs.map( (item: IAttrs) => {
            if (typeof item.value === "string") {
                return `${item.name}: '${item.value}',`
            } else {
                return  `${item.name}: ${item.value},`
            }
        }).join("")

        let styleAttrsBody = ""

        styleAttrs.forEach( (item: IAttrs) => {
            if (typeof item.value === "string") {
                styleAttrsBody += `${item.name}: '${item.value}',`
            } else {
                styleAttrsBody += `${item.name}: ${item.value},`
            }
        })

        let fileData = "\n" +
            `import { computed } from '@ember/object';
            export default Component.extend({
                layout,
                tagName:'div',
                classNames:['positon-relative', 'width-fit-content'],
                content: 'default',
                classNameBindings: [],
                attributeBindings: [],
                date: "",
                ${styleAttrsBody}
                ${attrsBody}
                currentStyle: computed("style", function() {
                    let style = this.get('style')
                    if (style) {
                        return "date-picker-" + style
                    } else {
                        return 'date-picker-default'
                    }
                }),
                currentWidth: computed("size", function() {
                    let size = this.get('size')
                    if (size) {
                        return "date-picker-width-" + size
                    } else {
                        return 'date-picker-width-default'
                    }
                }),
                confirmAction(){

                },
                didInsertElement() {
                    let that = this
                    laydate.render({
                        elem: "#" + this.get('pid'), //指定元素
                        range: this.get('range'),
                        type: this.get('type'),
                        min: this.get("min"),
                        max: this.get("max"),
                        theme: "gray",
                        btns: ['confirm'],
                        done: function(value) {
                            that.confirmAction(value)
                        }
                    });
                },
                actions: {`

        fileData = fileData  + "}"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        return `<Input id="{{pid}}" class="date-picker-input {{currentStyle}} {{currentWidth}}" @value={{mut date}} />
        {{svg-jar 'calendar' width='24px' height='24px' class='date-picker-icon' }}`
    }

}
