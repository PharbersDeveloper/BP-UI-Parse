"use strict"

import { EmberHelperExec } from "../bashexec/emberHelperExec"
import BPCtx from "../context/BPCtx"
import phLogger from "../logger/phLogger"
import { IHelperOptions } from "../properties/HelperOptions"
import { BPHelper } from "./BPHelper"
// import BPComp from "../Comp"
// import BPSlot from "../slotleaf/BPSlot"

export default class BPEq extends BPHelper {
    constructor(output: string, name: string, helperName: string) {
        super(output, name, helperName)
    }
    public paint() {
        const execList: any[] = []

        const options: IHelperOptions = {
            helperName: "bp-eq",
            logicData: this.paintLogic(), // js
            output: this.output,
            pName: this.projectName,
        }
        execList.push(new EmberHelperExec(options))

        return execList
    }

    public paintLogic() {
        // 继承自 BPWidget 的方法

        const fileDataStart = this.paintLoginStart("bpEq")
        const fileDataEnd = this.paintLoginEnd()

        const fileData = `return params[0] === params[1];
        `

        return fileDataStart + fileData + fileDataEnd
    }

}
