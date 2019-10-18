"use strict"

import { BashExec } from "./bashexec"

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
                transformGroup: "scss"

              }
            },
            source: ["src/scssStyles/**/*.json"]
          })

        StyleDictionary.buildAllPlatforms()
    }

}
