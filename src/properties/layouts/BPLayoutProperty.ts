"use strict"

// import { CssProperty } from "../CssPerperty"
import { BPThemeProperty } from "../themes/BPThemeProperty"

export class BPLayoutProperty  extends BPThemeProperty {
    protected normals: Array<{key: string, v: any}> = [
        { key: "display", v: "flex" },
        { key: "flex-direction", v: "column" }
    ]
    // protected properties: CssProperty[]
    constructor() {
        super()
    }
}
