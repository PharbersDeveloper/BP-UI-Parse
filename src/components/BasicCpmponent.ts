"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
import {CssProperty} from "../properties/CssPerperty"

@JsonObject("BasicComponent")
export class BasicComponent {

    // @JsonProperty("modes", [ModeConf])
    // public modes: ModeConf[] = undefined
    @JsonProperty("name", String)
    public name: string = "basic-component"

    @JsonProperty("description", String)
    public description: string = "some description for this component"

    @JsonProperty("cssProperties", [CssProperty])
    public cssProperties: CssProperty[] = undefined

    @JsonProperty("tagName", String)
    public tagName: string = "div"

    @JsonProperty("blueprintName", String)
    public blueprintName: string = "blue-test"
}
