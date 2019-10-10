"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
// import {CssStyle} from "./CssProperty"

@JsonObject("BasicComponent")
export class BasicComponent {

    // @JsonProperty("modes", [ModeConf])
    // public modes: ModeConf[] = undefined
    @JsonProperty("name", String)
    public name: string = "basic-component"

    @JsonProperty("description", String)
    public description: string = "some description for this component"

    @JsonProperty("styles", [String])
    public styles: string[] = []

    @JsonProperty("tagName", String)
    public tagName: string = "div"

    @JsonProperty("blueprintName", String)
    public blueprintName: string = "blue-test"

    @JsonProperty("classNames", [String])
    public classNames: string[] = []

    // @JsonProperty("mainLayout", String)
    // public mainLayout: string = "horizontal"

    @JsonProperty("components", [BasicComponent])
    public components: BasicComponent[] = []
}
