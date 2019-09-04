"use strict"

export abstract class CssProperty {
    protected tp: string = "css"
    protected key: string
    protected value: any
    protected description: string = undefined

    public getKey(): string {
        return this.key
    }

    public getValue(): any {
        return this.value
    }

    public getDescription(): string {
        if (this.description)
        return this.description
    }

    public toCssLine(cf: any) {
        return this.getKey() + " : " + this.getValue() + this.getDescription()
    }
}