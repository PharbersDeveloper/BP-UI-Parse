"use strict"

import { JsonObject, JsonProperty } from "json2typescript"

@JsonObject("ParseBlueprint")
export class ParseBlueprint {

    // @JsonProperty("fileMapTokens", Object)
    // get fileMapTokens() {
    // 	return {
    // 		__path__(options) {
    // 			if (options.pod) {
    // 				return path.join(options.podPath, options.locals.path, options.dasherizedModuleName)
    // 			}
    // 			return "components"
    // 		},
    // 		__name__(options) {
    // 			if (options.pod) {
    // 				return "component"
    // 			}
    // 			return options.dasherizedModuleName
    // 		},
    // 		__root__(options) {
    // 			if (options.inRepoAddon) {
    // 				return path.join("lib", options.inRepoAddon, "app")
    // 			}
    // 			return "addon"
    // 		},
    // 		__templatepath__(options) {
    // 			if (options.pod) {
    // 				return path.join(options.podPath, options.locals.path, options.dasherizedModuleName)
    // 			}
    // 			return "templates/components"
    // 		},
    // 		__templatename__(options) {
    // 			if (options.pod) {
    // 				return "template"
    // 			}
    // 			return options.dasherizedModuleName
    // 		},
    // 	}
    // }
    // get founded() { return this._founded }
    // set founded(value: number) { this._founded = value }

    @JsonProperty("tagName", String)
    public tagName: string = "div"

    @JsonProperty("description", String)
    public description: string = ""

    // This maps the JSON key "beautiful" to the class property "beautiful".
    // If the JSON value is not of type boolean (or missing), there will be an exception.
    @JsonProperty("beautiful", Boolean)
    public beautiful: boolean = undefined

    // This maps the JSON key "data" to the class property "data".
    // We are not sure about the type, so we omit the second parameter.
    // There will be an exception if the JSON value is missing.
    @JsonProperty("data") // is the same as @JsonProperty("data", Any)
    public data: any = undefined

    // This maps the JSON key "keywords" to the class property "keywords".
    // This is an example of a string array. Note our syntax "[String]".
    // In the further examples at the end of this document, you can see how to nest complex arrays.
    @JsonProperty("keywords", [String])
    public keywords: string[] = undefined // or Array<string>
    // This maps the JSON key "founded" to the private class property "_founded".
    // Note the use of public getter and setter.

    public printInfo() {
        // if (this.beautiful) {
        //     console.log(this.name + " was founded in " + this.founded + " and is really beautiful!")
        // }
        // else {
        //     console.log(this.name + " was founded in " + this.founded + ".")
        // }
    }

}
