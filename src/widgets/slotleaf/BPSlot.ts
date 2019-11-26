"use strict"

import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"

export default class BPSlot extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean) {
        const execList: any[] = []

        const options: IOptions = {
            comp,
            logicData: this.paintLogic(), // js
            output: this.output,
            pName: this.projectName,
            rName: this.routeName,
            showData: this.paintShow(), // hbs
            styleData: this.paintStyle() //  继承自 BPWidget 的方法, css
        }
        execList.push(new CompExec(options, isShow))

        return execList
    }
    public paintShow() {
        return `{{cp-leaf ssc="ssc" disconnect="disconnect"}}`
    }
    public paintStyle() {
        return ""
    }
    public paintLogic() {
        // 继承自 BPWidget 的方法
        const fileDataEnd = this.paintLoginEnd()

        const fileData = `import Component from '@ember/component';
        import { A } from '@ember/array';

        export default Component.extend({
            didInsertElement() {
                this.set("mstc", [A([]), A([]), A([])])

                this.sendAction("ssc", A([]), A([]), A([]))
              },
              willDestroyElement() {
                this.sendAction("disconnect", ...this.mstc)
                // this._super( ...arguments )
              }`

        return fileData + fileDataEnd
    }
}
