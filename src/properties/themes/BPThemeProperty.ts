"use strict"

import phLogger from "../../logger/phLogger"
import { CssProperty } from "../CssPerperty"

export class BPThemeProperty {
    // protected properties: CssProperty[] = []
    public properties: CssProperty[] = []

    // TODO: 修改配置文件
    protected normals: Array<{key: string, v: any}> = [
        { key: "height", v: "100px" },
        { key: "width", v: "100px" },
        { key: "margin-left", v: 8 },
        { key: "margin-right", v: 8 },
        { key: "margin-top", v: 8 },
        { key: "margin-bottom", v: 8 },
        { key: "padding-left", v: 8 },
        { key: "padding-right", v: 8 },
        { key: "padding-top", v: 8 },
        { key: "padding-bottom", v: 8 },
        { key: "background", v: "#FFFFFF" },
        // { key: "min-width", v: "80px" },
    ]

    constructor() {
        this.initDefaults()
    }

    public isPropertyExists(key: string): boolean {
        return this.properties.find((x) => x.key === key) !== undefined
    }

    public resetProperty(key: string, v: any, type?: string, pe?: string): void {

        const property = this.properties.find((x) => x.key === key)
        if (property && property.tp === type && property.pe === pe) {
            property.value = v
        } else {
            this.properties.push(
                {
                    key,
                    pe,
                    tp: type,
                    value: v,
                }
            )
        }
        // this.properties.find((x) => x.key === key).value = v
    }

    public queryProperty(key: string): any | undefined {
        return this.properties.find((x) => x.key === key).value
    }

    private initDefaults(...normals: Array<{key: string, v: any}>) {
        this.normals.forEach( (x) => {
            this.properties.push(
                {
                    key: x.key,
                    pe: "css",
                    tp: "css",
                    value: x.v,
                }
            )
        })
    }
}
