"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPProgressTracker extends BPWidget {
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
        let stepText = "["
        comp.attrs.stepText.forEach((it: string) => {
            stepText += "'" + it + "',"
        })
        stepText.substring(0, stepText.length - 1)
        stepText += "]"

        const fileData = "\n" +
            "import {computed} from '@ember/object';" + "\r" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'div'," + "\r" +
            "    classNames:['" + comp.name +  "']," + "\r" +
            "    content: 'default'," + "\r" +
            "    classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
            "    attributeBindings: ['']," + "\r" +
            "    curStep: " + comp.attrs.curStep + "," + "\r" +
            "    stepText: " + stepText + "," + "\r" +
            "    disabled: [" + comp.attrs.disableStep + "]," + "\r" +
            "    lineWidth: computed('this.curStep', function() { " + "\r" +
            "        let width = this.curStep * 170" + "\r" +
            "        if (this.curStep === 0) { " + "\r" +
            "            width = 0" + "\r" +
            "        } else { " + "\r" +
            "            width = 1 * 170 + 160 * (this.curStep - 1)" + "\r" +
            "        }" + "\r" +
            "        return 'width:' + width + 'px'" + "\r" +
            "    })," + "\r" +
            "    computeStepClass: computed('this.curStep', 'this.stepText', 'this.disabled',function () { " + "\r" +
            "        let arr = []" + "\r" +
            "        for (let i = 0; i < this.stepText.length; i++) { " + "\r" +
            "            let color = 'progress-tracker-step-unvisited'" + "\r" +
            "            if (this.curStep === i) { " + "\r" +
            "                color = 'progress-tracker-step-cur'" + "\r" +
            "            } else if (i < this.curStep) { " + "\r" +
            "                color = 'progress-tracker-step-visited'" + "\r" +
            "            } else if (this.disabled.includes(i)) { " + "\r" +
            "               color = 'progress-tracker-step-disabled'" + "\r" +
            "            }" + "\r" +
            "            arr.push(color)" + "\r" +
            "        }" + "\r" +
            "        return arr" + "\r" +
            "    }),"

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
        const step = "{{#each this.stepText as |step index| }}" + "\r" +
                "   <span class={{get computeStepClass index}}>{{step}}</span>" + "\r" +
                "{{/each}}"

        return "<div class='progress-tracker-container'>" + "\r" +
            "    <div class='progress-tracker-line' style={{lineWidth}}></div>" + "\r" +
            "        <div class='progress-tracker-step'>" + step + "</div>" + "\r" +
            "</div>"
    }

}
