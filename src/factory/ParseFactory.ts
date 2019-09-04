"use strict"
import {JsonObject, JsonProperty} from "json2typescript"
import { ModeConf } from "./ModeConf"

@JsonObject("ParseConf")
export class ParseConf {

    @JsonProperty("modes", [ModeConf])
    public modes: ModeConf[] = undefined
}
