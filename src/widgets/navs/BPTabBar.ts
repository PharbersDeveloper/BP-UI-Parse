"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPPushButton from "../buttons/BPPushButton"
import BPComp from "../Comp"

export default class BPTabBar extends BPWidget {
    public currentIndex: number = 0

    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }

    public setCurrentIndex(index: number): void {
        this.currentIndex = index
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

    public paintShow(comp: BPComp) {
            const insideComps = comp.components

            let showBody = ""
            insideComps.forEach((icomp) => {
                const navItem = new BPPushButton(this.output, this.projectName, this.routeName)
                showBody += navItem.paintShow(icomp)
            })
            return  "{{#" + comp.name + "}}" + showBody + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        const fileData = "import Component from '@ember/component';" + "\r" +
        "import layout from '../templates/components/" + comp.name + "';" + "\r" +
         "\n" +
        "export default Component.extend({" + "\r" +
          "   layout," + "\r" +
          "   tagName:'div'," + "\r" +
          "   classNames:['" + comp.name + "']," + "\r" +
          "   classNameBindings:['isColumn:flex-column']," + "\r" +
          "   isColumn: false," + "\r" +

        "});" + "\r"

        return fileData
    }
    public paintStyle(comp: BPComp) {
        // 该组件的 css 样式
        let fileData = "." + comp.name + "{" + "\r" + "\n"
        let styles: string = ""

        comp.css.filter((item) => item.tp === "css").forEach((item) => {
            const style = item.key + ": " + item.value + ";" + "\r"
            styles = styles + style
        })
        fileData = fileData + styles + "\r" + "}" + "\r"

        // 伪类
        comp.css.filter((item) => item.tp !== "css").forEach((item) => {
            let pseudoClass: string = "." + comp.name + ":" + item.tp + " {" + "\r" + "\n"
            const pseudoStyle = item.key + ": " + item.value + ";" + "\r"
            pseudoClass = pseudoClass + pseudoStyle + "\r" + "}" + "\r"
            fileData += pseudoClass
        })
        return fileData
    }
}
