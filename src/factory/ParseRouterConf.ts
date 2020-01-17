"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
import { ParseCompConf} from "./ParseCompConf"
import { ParseCssConf } from "./ParseCssConf"
import { ParsePtCtxConf } from "./ParsePtCtxConf"

@JsonObject("router")
export class ParseRouterConf {

    @JsonProperty("id", String)
    public id: string = ""

    @JsonProperty("path", String)
    public path: string = ""

    @JsonProperty("name", String)
    public name: string = ""

    @JsonProperty("css", [ParseCssConf])
    public css: ParseCssConf[] = []

    @JsonProperty("layout", [ParseCssConf])
    public layout: ParseCssConf[] = []

    @JsonProperty("components", [ParseCompConf])
    public components: ParseCompConf[] = []
}
