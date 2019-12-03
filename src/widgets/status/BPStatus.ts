"use strict"

import { CompExec } from "../../bashexec/compExec"
import { StatusExec } from "../../bashexec/widgets/status/statusExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPStatus extends BPWidget {
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
        return "{{#" + comp.name + "}}" + comp.text + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = `
        import { computed } from '@ember/object';
        export default Component.extend({
            layout,
            tagName:'span',
            classNames:['${comp.name}'],
            content: 'default',
            classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only', 'currentType', 'subtle:status-subtle:status-bold'],
            attributeBindings: [''],
            type: 'default',
            /**
             *type:
             *default/success/removed/in-progress/new/moved
            */
            currentType: computed('type', function () {
                let type = this.get('type');

                return "status-" + type
            }),
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
