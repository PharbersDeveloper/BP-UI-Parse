"use strict"

import { CssProperty } from "../CssPerperty"

export class BPThemeProperty {
    protected properties: CssProperty[] = []

    // TODO: 修改配置文件
    protected normals: Array<{key: string, v: any}> = [
        { key: "height", v: 100},
        { key: "width", v: 100},
        { key: "margin-left", v: 8},
        { key: "margin-right", v: 8},
        { key: "margin-top", v: 8},
        { key: "margin-bottom", v: 8},
        { key: "padding-left", v: 8},
        { key: "padding-right", v: 8},
        { key: "padding-top", v: 8},
        { key: "padding-bottom", v: 8},
        { key: "background", v: "#FFFFFF"},
    ]

    constructor() {
        this.initDefaults()
    }

    public isPropertyExists(key: string): boolean {
        return this.properties.find((x) => x.key === key) !== undefined
    }

    public resetProperty(key: string, v: any): void {
        this.properties.find((x) => x.key === key).value = v
    }

    public queryProperty(key: string): any | undefined {
        return this.properties.find((x) => x.key === key).value
    }

    private initDefaults(...normals: Array<{key: string, v: any}>) {
        this.normals.forEach( (x) => {
            this.properties.push(
                {
                    key: x.key,
                    tp: "css",
                    value: x.v,
                }
            )
        })
    }
}
