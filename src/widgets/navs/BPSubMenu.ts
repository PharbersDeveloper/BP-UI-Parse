"use strict"

import { CompExec } from "../../bashexec/compExec"
import { NavMenuExec } from "../../bashexec/widgets/navs/navMenuExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPPushButton from "../buttons/BPPushButton"
import BPComp from "../Comp"
import BPMenuItem from "./BPMenuItem"

export default class BPSubMenu extends BPWidget {

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
            "    tagName: 'li'," + "\r" +
            "    classNames:['" + comp.name + "']," + "\r" +
            "    classNameBindings: ['isActive:menu-active']," + "\r" +
            "    attributeBindings: ['disabled']," + "\r" +
            "    disabled: false," + "\r" +
            "   text: ''," + "\r" +
            "   show: false," + "\r" +
            "   actions: {" + "\r" +
            "       toggleShow() {" + "\r" +
            "           this.toggleProperty('show')" + "\r" +
            "       }" + "\r" +
            "   }" + "\r"

        return fileDataStart + fileData + fileDataEnd
    }
    public paintShow(comp: BPComp, i?: number, cI?: string | number) {
        const iComps = comp.components
        const index = i ? i : 0
        const curIn = cI ? cI : 0
        const menuItem = new BPMenuItem(this.output, this.projectName, this.routeName)

        if (iComps.length > 0 ) {
            const showStart = "{{#" + comp.name + " text='" + comp.text + "'}}" + "\r"
            const showEnd = "\r" + "{{/" + comp.name + "}}\r\n"
            let showBody: string = ""

            iComps.forEach((item) => {
                showBody += menuItem.paintShow(item) + "\r\n"
            })
            return showStart + showBody + showEnd
        }
        return menuItem.paintShow(comp)
    }
    public paintHBS() {
        // return "{{yield}}"
        const data = "<div class='bp-submenu-title'  {{action 'toggleShow'}}>" + "\r\n" +
            "{{svg-jar 'point' width='24px' height='24px' class='icon'}}" + "\r\n" +
            "<span>{{text}}</span>" + "\r\n" +
            "</div>" + "\r\n" +
            "<ul class={{if show 'menu-sub' 'd-none'}}>{{yield}}</ul>" + "\r\n"

        return data
     }
}
