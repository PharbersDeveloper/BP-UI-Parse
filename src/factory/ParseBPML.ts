"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
import { ParsePtCtxConf } from "./ParsePtCtxConf"
import { ParseRouterConf } from "./ParseRouterConf"

@JsonObject("BPML")
export class ParseBPML {
    @JsonProperty("meta", ParsePtCtxConf)
    public meta: ParsePtCtxConf = undefined

    @JsonProperty("routers", [ParseRouterConf])
    public routers: ParseRouterConf[] = undefined
}
