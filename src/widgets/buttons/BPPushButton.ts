"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPPushButton extends BPWidget {
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
        if (comp.icon) {
          return  `{{#${comp.name}  ssc="ssc" emit="emit" disconnect="disconnect" icon=${comp.icon} }}${comp.text}{{/${comp.name}}}`
        }
        return `{{#${comp.name}  ssc="ssc" emit="emit" disconnect="disconnect"}}${comp.text}{{/${comp.name}}}`
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()

        const fileData = "\n" +
        `export default Component.extend({
            layout,
            tagName:'button',
            classNames:['bp-push-button', '${comp.name}'],
            content: 'default',
            classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only'],
            attributeBindings: ['disabled'],
            click() {
                let action = this.actions.emit;

                action.call(this,this,"click","")
                /**
                 * other way bind this
                 * const emit = action.bind(this);
                 * emit(this,"click","")
                 */
                return this.get('bubble');
            },
            actions: {
                emit( source, signal, data ) {
                    this.sendAction( "emit", source, signal, data )
                },
                disconnect( ss, ts, cs ) {
                    this.sendAction( "disconnect", ...this.mstc )
                },
                ssc( ss, ts, cs ) {
                    const mss = ss

                    mss.pushObject( { "source": this, "signal": "click" } )
                    const mts = ts

                    mts.pushObject( { "target": this, "slot": this.get( "actions.slots.onClick" ) } )
                    const mcs = cs

                    mcs.pushObject( {
                        "source": this,
                        "signal": "click",
                        "target": this,
                        "slot": this.get( "actions.slots.onClick" )
                    } )
                    this.set( "mstc",[mss,mts,mcs] )

                    this.sendAction( "ssc", mss, mts, mcs )
                },
                slots: {
                    onClick( target, data ) {
                        alert( "BP-UI-Parse bp-bush-button" + data)

                    }
                }
            },`

        return fileDataStart + fileData + fileDataEnd
    }
    public paintHBS() {
        const leaf = new BPSlot(this.output, this.projectName, this.routeName)

        return `
        ${leaf.paintShow()}
        {{svg-jar icon width='24px' height='24px' class='icon'}}
        {{text}}
        {{yield}}`
     }
}
