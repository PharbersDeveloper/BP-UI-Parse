"use strict"
import {JsonObject, JsonProperty} from "json2typescript"

@JsonObject("css")
export class ParseCssConf {
    @JsonProperty("width", Number)
    public width: number = 0

    @JsonProperty("height", Number)
    public height: number = 0

    @JsonProperty("background", String, true)
    public background: string = undefined
}
