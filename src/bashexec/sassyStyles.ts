"use strict"

import phLogger from "../logger/phLogger"
import { BashExec } from "./bashexec"
const baseValue = {
    color: {
        neutrals: (value:string)=> `hsla(218,76%,15%,${value})`
    },
    spacing: {
        compact: (value:number)=> `${2*value}px`,
        base: (value:number)=> `${2*value}px`
    }
}
export class SassyStyles extends BashExec {
    constructor( outputPath: string, projectName: string) {
        super()
        this.args = [ outputPath, projectName]
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
                  }],
                transformGroup: "custom/scss"
              }
            },
            source: ["/Users/frank/Documents/work/pharbers/BP-UI-Parse/src/scssStyles/**/*.json"]
          })

        StyleDictionary.registerTransform({
            name: "color/neutrals",
            type: "value",
            matcher(prop: any) {
                const attrs =  prop.attributes
                return attrs.category === "color" && attrs.type === "neutrals"
            },
            transformer(prop: any) {
              const value = prop.original.value
              if (!isNaN(value)) {
              return baseValue.color.neutrals(value)
              } else {
                return value
              }
            }
          })
        StyleDictionary.registerTransform({
            name: "color/comptext",
            type: "value",
            matcher(prop: any) {
              const attrs =  prop.attributes

              return attrs.category === "color" && attrs.subitem === "inverse"
            },
            transformer(prop: any) {
              phLogger.info(prop)
              return `rgb(0,0,0)`
            }
          })
        StyleDictionary.registerTransform({
            name: "spacing/compact",
            type: "value",
            matcher(prop: any) {
              const attrs =  prop.attributes
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
              const attrs =  prop.attributes
              const types: string[] = ["1x", "2x", "3x", "4x", "5x"]
              return attrs.category === "spacing" && types.includes(attrs.type)
            },
            transformer(prop: any) {
              const value = prop.original.value

              return baseValue.spacing.base(value)
            }
          })
        const transformGroup: string[] = ["color/neutrals", "color/comptext",
          "spacing/compact", "spacing/base", "name/cti/camel"]
        StyleDictionary.registerTransformGroup({
            name: "custom/scss",
            transforms: StyleDictionary.transformGroup.scss.concat(transformGroup)
          })

        StyleDictionary.buildAllPlatforms()
    }

}
