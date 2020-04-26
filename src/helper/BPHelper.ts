"use strict"

import { CompStylesRepaint } from "../bashexec/compStylesRepaint"
import BPCtx from "../context/BPCtx"
import { BPLayout } from "../layouts/BPLayout"
import phLogger from "../logger/phLogger"
import { BPObject } from "../object/BPObject"
import { CssProperty } from "../properties/CssPerperty"
import { IAttrs, IReStyleOpt } from "../properties/Options"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"

export abstract class BPHelper extends BPObject {

    public output: string = ""
    public projectName: string = ""
    public routeName: string = ""
    protected mainLayout: BPLayout = null

    constructor(output?: string, projName?: string, routeName?: string) {
        super()
        this.output = output
        this.projectName = projName
        this.routeName = routeName
    }

    public paintLoginStart(helperName: string) {
        const fileData =
     `import { helper } from '@ember/component/helper';
     export default helper(function helperName(params/*, hash*/) {

     `
        return fileData
    }
    public paintLoginEnd() {
        return "});" + "\r"
    }
}
