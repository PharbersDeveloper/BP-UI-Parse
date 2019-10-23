"use strict"

import { PushButtonExec } from "../../bashexec/widgets/buttons/pushButtonExec"

import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPPushButton extends BPWidget {
    // private output: string = ""
    // private projectName: string = ""
    // private routeName: string = ""

    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
        // this.output = output
        // this.projectName = name
        // this.routeName = routeName
    }
    public paint(ctx: BPCtx, comp: BPComp) {
        const execList: any[] = []
        const output = this.output
        const logicData = this.paintLogic(comp)
        const showData = this.paintShow(comp)

        execList.push(new PushButtonExec(output, this.projectName, this.routeName, comp, logicData, showData))

        return execList
    }
    public paintShow(comp: BPComp) {
       return  "{{#" + comp.name + "}}" + comp.text + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        const fileData = "import Component from '@ember/component';" + "\r" +
        "import layout from '../templates/components/" + comp.name + "';" + "\r" +
         "\n" +
        "export default Component.extend({" + "\r" +
          "   layout," + "\r" +
          "   tagName:'button'," + "\r" +
          "   classNames:['bp-push-button', '" + comp.name + "']," + "\r" +
          "   content: 'default'," + "\r" +
          "classNameBindings: ['block:btn-block', 'type', 'reverse', 'active', 'computedIconOnly:icon-only']," + "\r" +
          "attributeBindings: ['disabled']," + "\r" +
        "});" + "\r"

        return fileData
    }
}
