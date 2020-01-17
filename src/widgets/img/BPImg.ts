"use strict"

// import { InputExec } from "../../bashexec/widgets/inputs/inputExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPImg extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean) {
        const execList: any[] = []

        const options: IOptions = {
                comp,
                hbsData: this.paintHBS(),
                logicData: this.paintLogic(comp), // js
                output: this.output,
                pName: this.projectName,
                rName: this.routeName,
                showData: this.paintShow(comp), // hbs
                styleData: this.paintStyle(comp) //  继承自 BPWidget 的方法, css
        }
        execList.push(new CompExec(options, isShow))

        return execList
        }
    public paintShow(comp: BPComp) {
        return `{{#${comp.name} ssc="ssc" emit="emit" disconnect="disconnect"}}{{/${comp.name}}}`

    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const srcLink = comp.attrs.src
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = `
        export default Component.extend({
            layout,
            tagName:'img',
            classNames:['${comp.name}'],
            content: 'default',
            classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only'],
            attributeBindings: ['src'],
            src: '${srcLink}',
            click() {
                let action = this.actions.emit;

                action.call(this, this, "click", "")
                /**
                 * other way bind this
                 * const emit = action.bind(this);
                 * emit(this,"click","")
                 */
                return this.get('bubble');
            },
            mouseEnter() {
                let action = this.actions.emit;

                action.call(this, this, "mouseEnter", "")
            },
            mouseLeave() {
                let action = this.actions.emit;

                action.call(this, this, "mouseLeave", "")
            },
            actions: {
                emit(source, signal, data) {
                    this.sendAction("emit", source, signal, data)
                },
                disconnect(ss, ts, cs) {
                    this.sendAction("disconnect", ...this.mstc)
                },
                ssc(ss, ts, cs) {
                    const mss = ss

                    mss.pushObject({ "source": this, "signal": "click" })
                    const mts = ts

                    mts.pushObject({ "target": this, "slot": this.get("actions.slots.onClick") })
                    const mcs = cs

                    mcs.pushObject({
                        "source": this,
                        "signal": "click",
                        "target": this,
                        "slot": this.get("actions.slots.onClick")
                    })
                    mcs.pushObject({
                        "source": this,
                        "signal": "mouseEnter",
                        "target": this,
                        "slot": this.get("actions.slots.onMouseEnter")
                    })
                    mcs.pushObject({
                        "source": this,
                        "signal": "mouseLeave",
                        "target": this,
                        "slot": this.get("actions.slots.onMouseLeave")
                    })
                    this.set("mstc", [mss, mts, mcs])

                    this.sendAction("ssc", mss, mts, mcs)
                },
                slots: {
                    onClick(target, data) {
                        alert("BP-UI-Parse click event =>  ${comp.name}" + data)
                    },
                    onMouseEnter(target,data) {
                        window.console.log("BP-UI-Parse mouseEnber event =>  ${comp.name}" + data)
                    },
                    onMouseLeave(target,data) {
                        window.console.log("BP-UI-Parse mouseLeave event =>  ${comp.name}" + data)
                    }
                }
            },`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `${leaf.paintShow()}{{yield}}`
     }
}
