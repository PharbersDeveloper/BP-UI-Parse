"use strict"

import uuid from "uuid"
import phLogger from "../logger/phLogger"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"
import { BPSlot } from "../slot/CommonSlot"

/**
 * 定义信号和槽的一些列的数据传递
 */
export class BPObject {

    protected objId = uuid.v4()
    private signals = Array<string>()

    /**
     * registerSignals
     */
    public registerSignals(sgl: string): void {
        phLogger.info("alfred test")
    }

    /**
     * UnregisterSinals
     */
    public unRegisterSinals(sgl: string): void {
        phLogger.info("alfred test")
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
        phLogger.info("alfred test")
    }

    /**
     * emitSinals
     */
    public emit() {
        phLogger.info("alfred test")
    }

    public slot(func: (...args: any[]) => any): BPSlot {
        return new BPSlot(this, func)
    }

    protected initBPObject<T>() {
        phLogger.info("alfred test")
    }
}
