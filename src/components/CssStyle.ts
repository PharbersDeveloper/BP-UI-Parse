"use strict"

import {JsonObject, JsonProperty} from "json2typescript"
import {CssProperty} from "../properties/CssPerperty"

@JsonObject("CssStyle")
export class CssStyle extends CssProperty {

    @JsonProperty("tp", String)
    public tp: string = "css"

    @JsonProperty("key", String)
    public key: string = ""

    @JsonProperty("value", String)
    public value: string = ""

    @JsonProperty("description", String)
    public description?: string = ""

}
