"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
import { ParseCssConf } from "./ParseCssConf"
import { ParsePtCtxConf } from "./ParsePtCtxConf"

@JsonObject("router")
export class ParseRouterConf {

    @JsonProperty("id", String, )
    public id: string = ""

    @JsonProperty("path", String)
    public path: string = ""

    @JsonProperty("css", [ParseCssConf])
    public css: ParseCssConf[] = []
}
