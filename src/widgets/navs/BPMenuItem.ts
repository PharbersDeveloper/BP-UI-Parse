"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPPushButton from "../buttons/BPPushButton"
import BPComp from "../Comp"

export default class BPMenuItem extends BPPushButton {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            hbsData: this.paintHBS(),
            logicData: this.paintLogic(comp),
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.paintStyle(comp)
        }
        execList.push(new CompExec(options, isShow))

        return execList
    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = "import { computed } from '@ember/object';" + "\r" +
            "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'li'," + "\r" +
            "    classNames:['bp-push-button','" + comp.name + "']," + "\r" +
            "    classNameBindings: ['isActive:menu-active']," + "\r" +
            "    attributeBindings: ['disabled']," + "\r" +
            "    disabled: false," + "\r" +
            "    isActive: computed('currentIndex',function() {" + "\r" +
            "        return this.currentIndex === this.index" + "\r" +
            "    })" + "\r"

        return fileDataStart + fileData + fileDataEnd
    }
    public paintShow(comp: BPComp, i?: number, cI?: string | number) {
        const index = i ? i : 0
        const curIn = cI ? cI : 0
        return "{{" + comp.name + " icon='" + comp.icon + "' text='" + comp.text + "'}}"
    }
    public paintHBS() {
        return "{{svg-jar icon width='24px' height='24px' class='icon'}}<span>{{text}}</span>"
     }
}
