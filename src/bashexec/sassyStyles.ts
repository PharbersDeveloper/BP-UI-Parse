"use strict"

import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

const baseValue = {
    border: {
        base: (value: number) => `${1 * value}px`
    },
    color: {
        neutrals: (value: string) => `hsla(218,76%,15%,${value})`
    },
    opacity: {
        base: 0.04,
        medium: 0.25
    },
    radius: {
        base: (value: number) => `${2 * value}px`
    },
    size: {
        base: (value: number) => `${8 * value}px`
    },
    spacing: {
        base: (value: number) => `${2 * value}px`,
        compact: (value: number) => `${2 * value}px`
    }

}
export class SassyStyles extends BashExec {
    constructor(outputPath: string, projectName: string) {
        super()
        this.args = [outputPath, projectName]
    }
    public async exec(callback: (code: number) => void) {

        this.generaScssVari(this.args[0], this.args[1])
        if (callback) {
            callback(0)
        }
    }
    private generaScssVari(outputPath: string, projectName: string) {
        const StyleDictionary = require("style-dictionary").extend({
            platforms: {
                scss: {
                    buildPath: outputPath + "/" + projectName + "/addon/styles/",
                    files: [{
                        destination: "variables.scss",
                        format: "scss/variables"
                    }, {
                        destination: "mixin.scss",
                        filter: (prop: any) => {
                            return prop.attributes.category === "mixin"
                        },
                        footer: "}",
                        format: "mixin-scss/variables",
                        header: `@mixin `,

                    }],
                    transformGroup: "custom/scss"
                }
            },
            source: ["/Users/frank/Documents/work/pharbers/BP-UI-Parse/src/scssStyles/**/*.json"]

        })
        StyleDictionary.registerFormat({
            name: "mixin-scss/variables",
            formatter(dictionary: any) {
                const header = this.header
                const footer = `\n ${this.footer}`
                const mixins = Object.keys(dictionary.properties.mixin)

                return mixins.map((mixin: string) => {
                    return `\n ${header} ${mixin} { \n` +
                        dictionary.allProperties.map((prop: any) => {
                            if (prop.path[1] === mixin) { return `    ${prop.path[2]}: ${prop.value};` }})
                            .filter((strVal: string) => !!strVal)
                            .join("\n") +
                        footer + ";"
                }).join("")
            }
          })
        StyleDictionary.registerTransform({
            name: "name/strike",
            type: "name",
            transformer(prop: any) {
                return prop.path.join("-")
            }
        })
        StyleDictionary.registerTransform({
            name: "spacing/compact",
            type: "value",
            matcher(prop: any) {
                const attrs = prop.attributes
                return attrs.category === "spacing" && attrs.type === "compact"
            },
            transformer(prop: any) {
                const value = prop.original.value

                return baseValue.spacing.compact(value)
            }
        })
        StyleDictionary.registerTransform({
            name: "spacing/base",
            type: "value",
            matcher(prop: any) {
                const attrs = prop.attributes
                const types: string[] = ["1x", "2x", "3x", "4x", "5x"]
                return attrs.category === "spacing" && types.includes(attrs.type)
            },
            transformer(prop: any) {
                const value = prop.original.value

                return baseValue.spacing.base(value)
            }
        })
        StyleDictionary.registerTransform({
            name: "size/base",
            type: "value",
            matcher(prop: any) {
                const attrs = prop.attributes
                const types: string[] = ["1x", "2x", "3x", "4x", "5x", "6x", "10x",
                    "12x", "16x", "20x", "model"]
                return attrs.category === "size" && types.includes(attrs.type)
            },
            transformer(prop: any) {
                const value = prop.original.value

                return baseValue.radius.base(value)
            }
        })
        StyleDictionary.registerTransform({
            name: "radius/base",
            type: "value",
            matcher(prop: any) {
                const attrs = prop.attributes
                const types: string[] = ["small", "medium", "large"]
                return attrs.category === "radius" && types.includes(attrs.type)
            },
            transformer(prop: any) {
                const value = prop.original.value

                return baseValue.size.base(value)
            }
        })
        StyleDictionary.registerTransform({
            name: "border/base",
            type: "value",
            matcher(prop: any) {
                const attrs = prop.attributes
                const types: string[] = ["none", "light", "regular", "medium", "heavy"]
                return attrs.category === "border" && types.includes(attrs.type)
            },
            transformer(prop: any) {
                const value = prop.original.value

                return baseValue.border.base(value)
            }
        })
        StyleDictionary.registerTransform({
            name: "opacity/base",
            type: "value",
            matcher(prop: any) {
                const attrs = prop.attributes
                const types: string[] = ["transparent", "04s", "08s", "10s"]
                return attrs.category === "border" && types.includes(attrs.type)
            },
            transformer(prop: any) {
                const value = prop.original.value

                return baseValue.opacity.base * value
            }
        })
        StyleDictionary.registerTransform({
            name: "opacity/medium",
            type: "value",
            matcher(prop: any) {
                const attrs = prop.attributes
                const types: string[] = ["20s", "40s", "50s", "60s", "90s"]
                return attrs.category === "border" && types.includes(attrs.type)
            },
            transformer(prop: any) {
                const value = prop.original.value

                return baseValue.opacity.medium + value
            }
        })
        const transformGroup: string[] = ["name/strike", "spacing/compact",
            "spacing/base", "size/base",
            "radius/base", "border/base", "opacity/base",
            "opacity/medium"]
        StyleDictionary.registerTransformGroup({
            name: "custom/scss",
            transforms: StyleDictionary.transformGroup.scss.concat(transformGroup)
        })

        StyleDictionary.buildAllPlatforms()
    }

}
