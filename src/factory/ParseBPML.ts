"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
import { ParseRouterConf } from "./ParseRouterConf"

@JsonObject("BPML")
export class ParseBPML {

    @JsonProperty("router", [ParseRouterConf])
    public routers: ParseRouterConf[] = undefined
}
