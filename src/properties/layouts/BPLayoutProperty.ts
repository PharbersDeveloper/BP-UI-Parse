"use strict"

// import { CssProperty } from "../CssPerperty"
import { BPThemeProperty } from "../themes/BPThemeProperty"

export class BPLayoutProperty  extends BPThemeProperty {
    // protected properties: CssProperty[]
    protected normals: Array<{key: string, v: any}> = [
        { key: "display", v: "flex" },
        { key: "flex-direction", v: "column" }
    ]
}
