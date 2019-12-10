"use strict"

import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"

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
                        filter: (prop: any) => {
                            return prop.attributes.category !== "mixin"
                        },
                        format: "scss/variables"

                    },
                    {
                        destination: "mixin.scss",
                        filter: (prop: any) => {
                            return prop.attributes.category === "mixin"
                        },
                        footer: "}",
                        format: "mixin-scss/variables",
                        header: `@mixin `,
                    },
                    {
                        destination: "class.scss",
                        filter: (prop: any) => {
                            return prop.attributes.category === "mixin"
                        },
                        footer: "}",
                        format: "class-scss/variables"
                    }
                    ],
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
                const mixins = Object.keys(dictionary.properties.mixin || {})

                return mixins.map((mixin: string) => {
                    return `\n ${header} ${mixin} { \n` +
                        dictionary.allProperties.map((prop: any) => {
                            if (prop.path[1] === mixin) { return `    ${prop.path[2]}: ${prop.value};` }
                        })
                            .filter((strVal: string) => !!strVal)
                            .join("\n") +
                        footer + ";"
                }).join("")
            }
        })

        StyleDictionary.registerFormat({
            name: "class-scss/variables",
            formatter(dictionary: any) {

                const footer = `\n ${this.footer}`
                const mixins = Object.keys(dictionary.properties.mixin || {})

                return mixins.map((mixin: string) => {
                    return `\n.${mixin} { \n` +
                        dictionary.allProperties.map((prop: any) => {
                            if (prop.path[1] === mixin) { return `    ${prop.path[2]}: ${prop.value};` }
                        })
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

        const transformGroup: string[] = ["name/strike", "size/px",
            "color/hex"]
        StyleDictionary.registerTransformGroup({
            name: "custom/scss",
            transforms: StyleDictionary.transformGroup.scss.concat(transformGroup)
        })

        StyleDictionary.buildAllPlatforms()
    }

}
