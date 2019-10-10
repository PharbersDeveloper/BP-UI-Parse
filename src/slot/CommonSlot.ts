"use strict"

import { BPObject } from "../object/BPObject"

export class BPSlot {

    private target: BPObject = null
    private tf: (...args: any[]) => any

    constructor(target: BPObject, tri: (...args: any[]) => any) {
        this.target = target
        this.tf = tri
    }

    public trigger(...args: any[]): any {
        return this.tf(args)
    }
}
