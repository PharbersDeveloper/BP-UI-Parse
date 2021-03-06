"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
import { ParseCssConf } from "./ParseCssConf"

@JsonObject("meta")
export class ParsePtCtxConf {

    @JsonProperty("paint", [String] )
    public ctxs: string[] = []

    @JsonProperty("name", String)
    public name: string = ""
}
