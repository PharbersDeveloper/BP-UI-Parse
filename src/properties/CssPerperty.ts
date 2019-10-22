"use strict"

import { CommonProperty } from "./CommonPerperty"

export class CssProperty extends CommonProperty {
    public tp: string = "css"
    public pe: string = "css"
    public key: string
    public value: any
    public description?: string = ""
}
