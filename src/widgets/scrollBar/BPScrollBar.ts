"use strict"

import { ScrollBarExec } from "../../bashexec/widgets/scrollBar/scrollBarExex"

import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
export default class BPScrollBar extends BPWidget {
  // private output: string = ""
  // private projectName: string = ""
  // private routeName: string = ""

  constructor(output: string, name: string, routeName: string) {
    super(output, name, routeName)
    // this.output = output
    // this.projectName = name
    // this.routeName = routeName
  }
  public paint(ctx: BPCtx, comp: BPComp) {
    const execList: any[] = []
    execList.push(new ScrollBarExec(this.output, this.projectName, this.routeName, comp))

    return execList
  }
}
