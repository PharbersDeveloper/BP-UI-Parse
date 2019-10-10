"use strict"

import { BPObject } from "../object/BPObject"

export class BPSlot {

    private _target: BPObject = null
    private _trigger: (...args: any) => any

    constructor(target: BPObject, tri: (...args: any) => any) {
        this._target = target
        this._trigger = tri
    }

    public trigger(...args: any): any {
        return this._trigger(args)
    }
}