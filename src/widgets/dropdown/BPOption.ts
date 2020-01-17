"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import BPComp from "../Comp"
import BPMenuItem from "../navs/BPMenuItem"

export default class BPOption extends BPMenuItem {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }

    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = "import { computed } from '@ember/object';" + "\r" +
            "\n" +
            "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    tagName:'li'," + "\r" +
            "    classNames:['" + comp.name + "']," + "\r" +
            "    attributeBindings: ['disabled']," + "\r" +
            "    classNameBindings: ['isChoosed:option-active']," + "\r" +
            "    disabled: false," + "\r" +
            "    onClick() {}," + "\r" +
            "    click() {" + "\r" +
            "        this.onClick(this.text)" + "\r" +
            "    }," + "\r" +
            "    isChoosed: computed('choosedValue',function() {" + "\r" +
            "        return this.text === this.choosedValue" + "\r" +
            "    })" + "\r"

        return fileDataStart + fileData + fileDataEnd
    }
    public paintShow(comp: BPComp, yi?: number|string) {
        return "{{" + comp.name + " icon='" + comp.icon + "' text='" + comp.text + "'" +
            " onClick=(action " + yi + ".onChange) choosedValue=" + yi + ".val}}"
    }
    // public paintHBS() {
    //     return "{{svg-jar icon width='24px' height='24px' class='icon'}}<span>{{text}}</span>"
    //  }
}
