"use strict"
import { Any, JsonObject, JsonProperty } from "json2typescript"
import { ParseCssConf } from "./ParseCssConf"
import { ParsePtCtxConf } from "./ParsePtCtxConf"

@JsonObject("component")
export class ParseCompConf {
    @JsonProperty("attrs", Object, true)
    public attrs: Any = {}

    @JsonProperty("id", String)
    public id: string = ""

    @JsonProperty("type", String)
    public type: string = ""

    @JsonProperty("text", String)
    public text: string = ""

    @JsonProperty("name", String)
    public name: string = ""

    @JsonProperty("css", [ParseCssConf], true)
    public css: ParseCssConf[] = []

    @JsonProperty("layout", [ParseCssConf], true)
    public layout: ParseCssConf[] = []

    @JsonProperty("components", [ParseCompConf], true)
    public components: ParseCompConf[] = []
}
