"use strict"

import {JsonObject, JsonProperty} from "json2typescript"
import { BasicComponent } from "./BasicComponent"
import { BasicPage } from "./BasicPage"

@JsonObject("BasicUi")
export class BasicUi {

    @JsonProperty("page", BasicPage, true)
    public page?: BasicPage = null

    @JsonProperty("components", [BasicComponent])
    public components: BasicComponent[] = undefined

    // @JsonProperty("components", [Object])
    // public components: object[] = []
}
