"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
import { ModeConf } from "./ModeConf"

@JsonObject("BPML")
export class ParseRouterConf {

    @JsonProperty("id", String)
    public id: string = ""

    @JsonProperty("path", String)
    public path: string = ""
}
