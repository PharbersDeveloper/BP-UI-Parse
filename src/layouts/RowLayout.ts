"use strict"

import { BPLayout } from "./BPLayout"

export class RowLayout extends BPLayout {
    protected normals: Array<{key: string, v: any}> = [
        { key: "display", v: "flex" },
        { key: "flex-direction", v: "row" }
    ]
    constructor() {
        super()
        this.initDefaults()
    }
}
