"use strict"

import { CompExec } from "../../bashexec/compExec"
import { NavMenuExec } from "../../bashexec/widgets/navs/navMenuExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPPushButton from "../buttons/BPPushButton"
import BPComp from "../Comp"
import BPOption from "./BPOption"

export default class BPSelect extends BPWidget {

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
            "    classNames:['" + comp.name + "']," + "\r" +
            "    classNameBindings: ['isActive:menu-active']," + "\r" +
            "    attributeBindings: ['disabled']," + "\r" +
            "    disabled: false," + "\r" +
            "    chooseValue: '请选择'," + "\r"  +
            "    show: false," + "\r" + 
            "    actions: {" + "\r" + 
            "        toggleShow() {" + "\r" + 
            "            this.toggleProperty('show')" + "\r" + 
            "        }," + "\r" + 
            "}" + "\r"

        return fileDataStart + fileData + fileDataEnd
    }
    public paintShow(comp: BPComp, i?: number, cI?: string | number) {
        const iComps = comp.components
        const index = i ? i : 0
        const curIn = cI ? cI : 0
        const menuItem = new BPOption(this.output, this.projectName, this.routeName)

        const showStart = "{{#" + comp.name + "}}" + "\r"
        const showEnd = "\r" + "{{/" + comp.name + "}}\r\n"
        let showBody = "<ul class='bp-option-group'>" + "\r\n"

        iComps.forEach((item) => {
            showBody += menuItem.paintShow(item) + "\r\n"
        })
        return showStart + showBody + "</ul>\r\n" + showEnd

    }

    public paintHBS() {
        const selectTitle = "<div class='bp-select-title' {{action 'toggleShow'}}><span>{{chooseValue}}</span>" +
        "{{svg-jar 'down' width='24px' height='24px' class='icon'}}</div>"
        return selectTitle + "{{#if show}}{{yield}}{{/if}}"
    }
}
