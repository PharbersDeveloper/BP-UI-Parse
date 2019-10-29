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

    @JsonProperty("cat", String, true)
    public cat: string = "1"
    // 默认为“1” 代表已经存在的组件,"0"代表组件需要生成

    @JsonProperty("type", String)
    public type: string = ""

    @JsonProperty("text", String, true)
    public text: string = ""

    @JsonProperty("icon", String, true)
    public icon: string = ""

    @JsonProperty("name", String)
    public name: string = ""

    @JsonProperty("css", [ParseCssConf], true)
    public css: ParseCssConf[] = []

    @JsonProperty("layout", [ParseCssConf], true)
    public layout: ParseCssConf[] = []

    @JsonProperty("components", [ParseCompConf], true)
    public components: ParseCompConf[] = []
}
