"use strict"

import { BPLayout } from "./BPLayout"

export  class BPColumnLayout extends BPLayout {
    protected normals: Array<{key: string, v: any}> = [
        { key: "display", v: "flex" },
        { key: "flex-direction", v: "column" },

    ]
    constructor() {
        super()
    }
}
