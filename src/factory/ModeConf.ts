"use strict"
import {JsonObject, JsonProperty} from "json2typescript"

@JsonObject("mode")
export class ModeConf {

    @JsonProperty("key", String)
    public key: string = undefined

    @JsonProperty("func", String)
    public func: string = undefined
}
