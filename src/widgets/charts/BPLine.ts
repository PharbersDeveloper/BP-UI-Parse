"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import BPComp from "../Comp"
import BPChart from "./BPChart"

export default class BPLine extends BPChart {

    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            // hbsData: this.paintHBS(),
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
    // public paintLogic(comp: BPComp) {
    //     const fileDataStart = this.paintLoginStart(comp)
    //     const fileDataEnd = this.paintLoginEnd()

    //     const fileData = "export default Component.extend({" + "\r" +
    //         "    layout," + "\r" +
    //         "    classNames:['" + comp.name + "']," + "\r" +
    //         "    classNameBindings: ['disabled:select-disabled']," + "\r" +
    //         "    disabled: false," + "\r" +
    //         "    didInsertElement() {" + "\r" +
    //         "        this._super(...arguments);" + "\r" +
    //         "        if(this.defaultValue) {" + "\r" +
    //         "            this.set('choosedValue',this.defaultValue)" + "\r" +
    //         "        }" + "\r" +
    //         "    }"

    //     return fileDataStart + "\r\n" + fileData + fileDataEnd
    // }

    // public paintHBS() {
    //     const selectTitle = "{{yield}}" +
    //         "</ul>"

    //     return selectTitle
    // }
}
