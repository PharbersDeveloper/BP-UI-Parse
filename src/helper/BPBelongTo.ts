"use strict"

import { EmberHelperExec } from "../bashexec/emberHelperExec"
import BPCtx from "../context/BPCtx"
import phLogger from "../logger/phLogger"
import { IHelperOptions } from "../properties/HelperOptions"
import { BPHelper } from "./BPHelper"
// import BPComp from "../Comp"
// import BPSlot from "../slotleaf/BPSlot"

export default class BPBelongTo extends BPHelper {
    constructor(output: string, name: string, routeName: string) {
        super(output, name, routeName)
    }
    public paint() {
        const execList: any[] = []

        const options: IHelperOptions = {
            helperName: "belong-to",
            logicData: this.paintLogic(), // js
            output: this.output,
            pName: this.projectName,
            rName: this.routeName
        }
        execList.push(new EmberHelperExec(options))

        return execList
    }

    public paintLogic() {
        // 继承自 BPWidget 的方法

        const fileDataStart = this.paintLoginStart("bpEq")
        const fileDataEnd = this.paintLoginEnd()

        const fileData = `
        if (params.length < 2) {
            return false
          }

          let arr = params[0],
            item = params[1],
            tempArr= [].concat(...arr) // 多维数组展开

          return tempArr.includes(item);
        `

        return fileDataStart + fileData + fileDataEnd
    }

}
