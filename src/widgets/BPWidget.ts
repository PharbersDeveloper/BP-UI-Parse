"use strict"

import { CompStylesRepaint } from "../bashexec/compStylesRepaint"
import BPCtx from "../context/BPCtx"
import { BPLayout } from "../layouts/BPLayout"
import phLogger from "../logger/phLogger"
import { BPObject } from "../object/BPObject"
import { CssProperty } from "../properties/CssPerperty"
import { IAttrs, IReStyleOpt } from "../properties/Options"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"
import BPComp from "./Comp"

export abstract class BPWidget extends BPObject {

    public css: CssProperty[] = []
    public output: string = ""
    public projectName: string = ""
    public routeName: string = ""
    protected mainLayout: BPLayout = null
    private theme: BPThemeProperty = null

    constructor(output?: string, projName?: string, routeName?: string) {
        super()
        this.output = output
        this.projectName = projName
        this.routeName = routeName
    }
    // 生成 展示用的 hbs 代码
    public paintShow(comp: BPComp, ...rest: any[]) {
        phLogger.info("alfred paintShow test")
        return ""
    }
    public paintStyle(comp: BPComp, prefix?: string) {

        // 该组件的 css 样式
        const alreadyClassName = comp.className ? comp.className : comp.name
        const className = "." + alreadyClassName + " {" + "\r" + "\n"
        // const className = "." + comp.name + " {" + "\r" + "\n"
        let fileData = prefix ? "." + prefix + " " + className : className
        let styles: string = ""

        comp.css.filter((item) => item.tp === "css" && item.pe === "css").forEach((item) => {
            const style = item.key + ": " + item.value + ";" + "\r"
            styles = styles + style
        })
        fileData = comp.css.length > 0 ? fileData + styles + "\r" + "}" + "\r" : ""

        // 伪类
        comp.css.filter((item) => item.tp !== "css" && item.pe === "css").forEach((item) => {
            const pseudoClassName = "." + comp.name + ":" + item.tp + " {" + "\r" + "\n"
            let pseudoClass: string = prefix ? "." + prefix + " " + pseudoClassName : pseudoClassName
            const pseudoStyle = item.key + ": " + item.value + ";" + "\r"
            pseudoClass = pseudoClass + pseudoStyle + "\r" + "}" + "\r"
            fileData += pseudoClass
        })

        // 伪元素 pseudu element
        comp.css.filter((item) => item.pe !== "css" && item.tp === "css").forEach((item) => {
            const pseudoEleName = "." + comp.name + "::" + item.pe + " {" + "\r" + "\n"
            let pseudoEle: string = prefix ? "." + prefix + " " + pseudoEleName : pseudoEleName
            const pseudoStyle = item.key + ": " + item.value + ";" + "\r"
            pseudoEle = pseudoEle + pseudoStyle + "\r" + "}" + "\r"
            fileData += pseudoEle
        })

        // 伪类 + 伪元素
        comp.css.filter((item) => item.pe !== "css" && item.tp !== "css").forEach((item) => {
            const pseudoEleName = "." + comp.name + ":" + item.tp + "::" + item.pe + " {" + "\r" + "\n"
            let pseudoEle: string = prefix ? "." + prefix + " " + pseudoEleName : pseudoEleName
            const pseudoStyle = item.key + ": " + item.value + ";" + "\r"
            pseudoEle = pseudoEle + pseudoStyle + "\r" + "}" + "\r"
            fileData += pseudoEle
        })

        let insideCompsStyle = ""
        if (Array.isArray(comp.components) && comp.components.length > 0) {
            comp.components.filter((item) => item.css.length > 0).forEach((icomp) => {
                insideCompsStyle += this.paintStyle(icomp, comp.name)
            })
        }
        return fileData + insideCompsStyle

    }
    public paintLogic(comp: BPComp) {
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = ""

        return fileDataStart + fileData + fileDataEnd
    }
    public paintLoginStart(comp: BPComp) {
        const fileData = "import Component from '@ember/component';" + "\r" +
            "import layout from '../templates/components/" + comp.name + "';" + "\r"
        // "\n" +
        // "export default Component.extend({" + "\r" +
        // "    layout," + "\r"
        return fileData
    }
    public paintLoginEnd() {
        return "});" + "\r"
    }
    public slotActions(events: string[], compName: string) {
        const actionsHeader = `
        actions: {
            emit(source, signal, data) {
                this.sendAction("emit", source, signal, data)
            },
            disconnect(ss, ts, cs) {
                this.sendAction("disconnect", ...this.mstc)
            },
            ssc(ss, ts, cs) {
                const mss = ss
                const mts = ts
                const mcs = cs

            `
        let actionsSSC = ""
        const actionsFooter = `this.set("mstc", [mss, mts, mcs])
            this.sendAction("ssc", mss, mts, mcs)
            },`
        const slotsHeader = "slots: {"
        const slotFooter = `}`
        let slotsBody = ""
        let bodys = null
        let trigger = ""
        events.forEach((event) => {
            switch (true) {
                case event === "click":
                    bodys = this.ssbody(actionsSSC, slotsBody, trigger, "click")
                    actionsSSC = bodys.actionsSSC
                    slotsBody = bodys.slotsBody
                    trigger = bodys.trigger
                    break
                case event === "mouseEnter":
                    bodys = this.ssbody(actionsSSC, slotsBody, trigger, "mouseEnter")
                    actionsSSC = bodys.actionsSSC
                    slotsBody = bodys.slotsBody
                    trigger = bodys.trigger
                    break
                case event === "mouseLeave":
                    bodys = this.ssbody(actionsSSC, slotsBody, trigger, "mouseLeave")
                    actionsSSC = bodys.actionsSSC
                    slotsBody = bodys.slotsBody
                    trigger = bodys.trigger
                    break
                case event === "focus":
                    bodys = this.ssbody(actionsSSC, slotsBody, trigger, "focus")
                    actionsSSC = bodys.actionsSSC
                    slotsBody = bodys.slotsBody
                    trigger = bodys.trigger
                    break
                case event === "blur":
                    bodys = this.ssbody(actionsSSC, slotsBody, trigger, "blur")
                    actionsSSC = bodys.actionsSSC
                    slotsBody = bodys.slotsBody
                    trigger = bodys.trigger
                    break
                case event === "input":
                    // input event is fired every time the value of the element changes
                    bodys = this.ssbody(actionsSSC, slotsBody, trigger, "input")
                    actionsSSC = bodys.actionsSSC
                    slotsBody = bodys.slotsBody
                    trigger = bodys.trigger
                    break
                case event === "change":
                    // change event only fires when the value is committed
                    bodys = this.ssbody(actionsSSC, slotsBody, trigger, "change")
                    actionsSSC = bodys.actionsSSC
                    slotsBody = bodys.slotsBody
                    trigger = bodys.trigger
                    break
                case event === "dblclick":
                    bodys = this.ssbody(actionsSSC, slotsBody, trigger, "dblclick")
                    actionsSSC = bodys.actionsSSC
                    slotsBody = bodys.slotsBody
                    trigger = bodys.trigger
                    break
                default:
                    break
            }
        })

        return `${trigger}
                ${actionsHeader}
                ${actionsSSC}
                ${actionsFooter}
                ${slotsHeader}
                ${slotsBody}
                ${slotFooter}`
    }
    public showProperties(arr: IAttrs[], comp?: BPComp) {
        return arr.map((item: IAttrs) => {

            switch (item.type) {
                case "string":
                    if (item.name === "classNames") {
                        return ` ${item.name}="${item.value} ${comp.className}"`
                    }
                    return ` ${item.name}="${item.value}"`
                case "number":
                case "boolean":
                case "variable":
                case "callback":
                    return ` ${item.name}=${item.value}`
                case "function":
                case "object":
                case "array":
                    return ``
                default:
                    if (item.name === "classNames") {
                        return ` ${item.name}="${item.value} ${comp.className}"`
                    }
                    return ` ${item.name}="${item.value}"`
            }
        }).join("")
    }
    // 使用 json 生成组件的 component.js 时，需要将 attrs / styleAttrs 中的属性
    // 写入到组件的 component.js 中
    public logicAttrs(attrs: IAttrs[]) {
        return  attrs.map((item: IAttrs) => {

            if (item.type === "string" || !item.type) {
                return `${item.name}: "${item.value}",\n`
            } else if (item.type === "variable") {
                return ``
            } else {
                return `${item.name}: ${item.value},\n`
            }

        }).join("")
    }
    // 生成当前组件实例的样式，通过 comp.className 属性（或 comp.name）
    // 以及将样式数据写入 addon.scss
    // 同时在 dummy 中生成展示，供之后项目中使用参考。
    public paintStylesShow(comp: BPComp) {
        const execList: any[] = []
        const options: IReStyleOpt = {
            comp,
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(comp),
            styleData: this.repaintStyles(comp)
        }
        execList.push(new CompStylesRepaint(options))

        return execList
    }
    protected paint(ctx: BPCtx, comp?: BPComp, isShow?: boolean) {
        phLogger.info("alfred paint test")
    }
    protected repaintStyles(comp: BPComp) {
        return this.createChainStyles(comp)
    }
    protected hitSize() {
        phLogger.info("alfred paint test")
    }
    private generateSSC(event: string) {

        const firstUpperCase = event.replace(/( |^)[a-z]/g, (L: string) => L.toUpperCase())
        return {
            slot: `on${firstUpperCase}(target,data) {
                window.console.log("BP-UI-Parse ${firstUpperCase} event => " + data)
            },`,
            ssc: `
            mss.pushObject({ "source": this, "signal": "${event}" })
            mts.pushObject({ "target": this, "slot": this.get("actions.slots.on${firstUpperCase}") })
            mcs.pushObject({
               "source": this,
               "signal": "${event}",
               "target": this,
               "slot": this.get("actions.slots.on${firstUpperCase}")
           })`,
            trigger: `${event}() {
                let action = this.actions.emit;

                action.call(this, this, "${event}", "")
            },
            `
        }
    }
    private ssbody(actionsSSC: string, slotsBody: string, trigger: string, event: string) {
        const clickSS = this.generateSSC(event)

        return {
            actionsSSC: actionsSSC += clickSS.ssc,
            slotsBody: slotsBody += clickSS.slot,
            trigger: trigger += clickSS.trigger
        }
    }

    private createChainStyles(comp: BPComp, prefix: string = "") {

        const className: string = comp.className || comp.name
        const pointClass: string = prefix ? `${prefix} .${className} ` : `.${className} `
        const styleProperties: CssProperty[] = [...comp.css, ...comp.layout]
        if (styleProperties.length === 0) {
            return `\r`
        }
        let pseudoStyleBody: string = ""
        const baseClass: CssProperty[] = styleProperties.filter((item) => item.pe === "css" && item.tp === "css")

        styleProperties.forEach((item: CssProperty) => {
            let insidePointClass: string = ""
            let styleCont: string = ""
            switch (true) {
                // 处理伪类
                case (item.pe === "css" && item.tp !== "css"):
                    insidePointClass = `${prefix} .${className}:${item.tp}`
                    styleCont = `    ${item.key}: ${item.value};\r`
                    pseudoStyleBody += `\r${insidePointClass} {\r${styleCont}}\r`
                    break
                // 处理伪元素
                case (item.pe !== "css" && item.tp === "css"):
                    insidePointClass = `${prefix} .${className}::${item.pe}`
                    styleCont = `    ${item.key}: ${item.value};\r`
                    pseudoStyleBody += `\r${insidePointClass} {\r${styleCont}}\r`
                    break
                // 处理伪类 + 伪元素
                case (item.pe !== "css" && item.tp !== "css"):
                    insidePointClass = `${prefix} .${className}:${item.tp}::${item.pe}`
                    styleCont = `    ${item.key}: ${item.value};\r`
                    pseudoStyleBody += `\r${insidePointClass} {\r${styleCont}}\r`
                    break
                // 处理标准的 css
                case (item.pe === "css" && item.tp === "css"):
                default:
                    // styleCont = `    ${item.key}: ${item.value};\r`
                    // pseudoStyleBody += `${pseudoStyleBody}\r${insidePointClass} {\r${styleCont}}\r`
                    break
            }
        })

        const baseStyleBody = baseClass.map((prop: CssProperty) => {
            return `    ${prop.key}: ${prop.value};\r`
        }).join("")

        const styles = `${pseudoStyleBody}\r${pointClass} {\r${baseStyleBody}}\r`
        const insideStyles: string = comp.components.map((ele) => this.createChainStyles(ele, pointClass)).join("")
        return styles + insideStyles
    }
}
