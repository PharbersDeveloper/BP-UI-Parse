"use strict"

import {JsonObject, JsonProperty} from "json2typescript"
import { CssStyle } from "./CssStyle"

@JsonObject("TotalStyle")
export class TotalStyle {

    // @JsonProperty("styles", [CssProperty], true)
    // public styles?: CssProperty[] = null

    @JsonProperty("styles", [CssStyle])
    public styles: CssStyle[] = []

}
