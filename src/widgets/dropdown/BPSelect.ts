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

        const fileData = "export default Component.extend({" + "\r" +
            "    layout," + "\r" +
            "    classNames:['" + comp.name + "']," + "\r" +
            "    classNameBindings: ['disabled:select-disabled']," + "\r" +
            "    attributeBindings: ['tabIndex']," + "\r" +
            "    disabled: false," + "\r" +
            "    choosedValue: '请选择'," + "\r" +
            "    show: false," + "\r" +
            "    tabIndex: '1'," + "\r" +
            "    defaultValue: ''," + "\r" +
            "    focusOut() {" + "\r" +
            "        this.set('show',false)" + "\r" +
            "    }," + "\r" +
            "    onChange() {}," + "\r" +
            "    actions: {" + "\r" +
            "        toggleShow() {" + "\r" +
            "            if(!this.disabled) {" + "\r" +
            "               this.toggleProperty('show')" + "\r" +
            "            }" + "\r" +
            "        }," + "\r" +
            "        change(text) {" + "\r" +
            "             this.set('choosedValue',text);" + "\r" +
            "             this.onChange(text)" + "\r" +
            "             this.set('show',false)" + "\r" +
            "         }" + "\r" +
            "    }," + "\r" +
            "    didInsertElement() {" + "\r" +
            "        this._super(...arguments);" + "\r" +
            "        if(this.defaultValue) {" + "\r" +
            "            this.set('choosedValue',this.defaultValue)" + "\r" +
            "        }" + "\r" +
            "    }"

        return fileDataStart + "\r\n" + fileData + fileDataEnd
    }
    public paintShow(comp: BPComp, i?: number, cI?: string | number) {
        const iComps = comp.components
        const index = i ? i : 0
        const curIn = cI ? cI : 0
        const menuItem = new BPOption(this.output, this.projectName, this.routeName)
        // TODO 可选参数
        const {choosedValue, disabled} = comp.attrs
        const cVal: string = choosedValue ? choosedValue : "请选择"
        const showStart = "{{#" + comp.name + " choosedValue='" + cVal + "' as |s|}}" + "\r"
        const showEnd = "{{/" + comp.name + "}}\r\n"
        let showBody = ""

        iComps.forEach((item) => {
            showBody += menuItem.paintShow(item, "s") + "\r\n"
        })
        return showStart + showBody + showEnd

    }

    public paintHBS() {
        const selectTitle = "<div class='bp-select-title' {{action 'toggleShow'}}><span>{{choosedValue}}</span>" +
            "{{svg-jar 'down' width='24px' height='24px' class='icon'}}</div>" +
            "<ul class={{if show 'bp-option-group' 'd-none'}}>" +
            "{{yield (hash" +
            "    onChange=(action 'change')" +
            "   val=choosedValue)}}" +
            "</ul>"

        return selectTitle
    }
}
