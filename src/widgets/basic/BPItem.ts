"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class BPItem extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            logicData: this.paintLogic(comp),
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.paintStyle(comp)
        }
        execList.push(new CompExec(options))

        return execList
    }
    public paintShow(comp: BPComp, i?: number, cI?: number|string) {
        // TODO 这里内部的子组件应该是不确定的
        const index = i ? i : 0
        const curIn = cI ? cI : 0
        return "{{#" + comp.name + " index=" + index + " currentIndex=" + curIn + "}}" + comp.text + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = "import { computed } from '@ember/object';" + "\r" +
        "\n" +
        "export default Component.extend({" + "\r" +
        "    layout," + "\r" +
        "    classNames:['" + comp.name + "']," + "\r" +
        "    index: 0," + "\r" +
        "    classNameBindings:['isCurrentIndex::d-none']," + "\r" +
        "    isCurrentIndex: computed('currentIndex',function() {" + "\r" +
        "        return this.currentIndex === this.index" + "\r" +
        "    })" + "\r"

        return fileDataStart + fileData + fileDataEnd
    }
}
