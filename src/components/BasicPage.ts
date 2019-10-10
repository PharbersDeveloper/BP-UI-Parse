"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
import {CssProperty} from "../properties/CssPerperty"

@JsonObject("BasicPage")
export class BasicPage {

    // @JsonProperty("modes", [ModeConf])
    // public modes: ModeConf[] = undefined

    @JsonProperty("name", String)
    public name: string = "basic-page"

    @JsonProperty("description", String)
    public description: string = "demo for page"

    @JsonProperty("styles", [CssProperty])
    public styles: CssProperty[] = undefined

    @JsonProperty("mainLayout", String)
    public mainLayout: string = "horizontal"

    @JsonProperty("blueprintName", String)
    public blueprintName: string = "blue-test"

    @JsonProperty("components", [String])
    public components: string[] = []
}
