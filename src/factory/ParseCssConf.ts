"use strict"
import { Any, JsonObject, JsonProperty } from "json2typescript"

@JsonObject("css")
export class ParseCssConf {
  @JsonProperty("k", String)
  public k: string = ""

  @JsonProperty("v", Any)
  public v: any = undefined

  @JsonProperty("tp", String, true)
  public tp: string = "css"

  @JsonProperty("pe", String, true)
  public pe: string = "css"
}
