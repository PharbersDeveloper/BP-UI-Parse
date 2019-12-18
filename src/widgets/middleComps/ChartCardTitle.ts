"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import {IAttrs} from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class ChartCardTitle extends BPWidget {

    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean = false) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            hbsData: this.paintHBS(comp),
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
        const { attrs } = comp

        const attrsBody = attrs.map( (item: IAttrs) => {

            if (item.type === "string" || !item.type) {
                return  `${item.name}: "${item.value}",\n`
            } else if (item.type === "variable") {
                return  ``
            } else {
                return  `${item.name}: ${item.value},\n`
            }

        }).join("")
        const fileData = "\n" +
            `export default Component.extend({
                layout,
                tagName: "h2",
                classNames:["${comp.name}"],
                ${attrsBody}`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintShow(comp: BPComp) {
        const {attrs, styleAttrs} = comp
        const attrsBody = [...attrs, ...styleAttrs].map( (item: IAttrs) => {

            switch (item.type) {
                case "string":
                    return ` ${item.name}="${item.value}"`
                case "number":
                case "boolean":
                    return ` ${item.name}=${item.value}`
                case "function":
                case "object":
                case "array":
                    return ``
                default:
                    return ` ${item.name}="${item.value}"`
            }
        }).join("")

        return `{{${comp.name} ${attrsBody}}}`
    }
    public paintHBS(comp: BPComp) {

        return `<span class="heading-medium">{{prodName}}</span> |
                <span class="heading-medium">{{title}}</span>
                <span class="body-secondary">{{provName}} {{cityName}}</span>`
    }

}
