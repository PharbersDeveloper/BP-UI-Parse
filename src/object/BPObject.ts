"use strict"

import uuid from "uuid"
import { BPSlot } from "../slot/CommonSlot"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"

/**
 * 定义信号和槽的一些列的数据传递
 */
export class BPObject {

    protected objId = uuid.v4();
    private signals = Array<string>()

    protected initBPObject<T>() {
        // this.theme = new Text()
    }

    /**
     * registerSignals
     */
    public registerSignals(sgl: string): void {
        
    }

    /**
     * UnregisterSinals
     */
    public unRegisterSinals(sgl: string): void {
        
    }

    /**
     * is singal exists
     */
    public isSglExists(sgl: string): boolean {
        return false
    }

    /**
     * 
     */
    public bind(sgl: string, slot: BPSlot) {

    }

    /**
     * emitSinals
     */
    public emit() {
        
    }

    public slot(func: (...args: any) => any): BPSlot {
        return new BPSlot(this, func)
    }
}