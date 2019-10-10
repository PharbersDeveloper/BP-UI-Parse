"use strict"

import { BPObject } from "../object/BPObject"
import { BPThemeProperty } from "../properties/themes/BPThemeProperty"
import { BPLayout } from "../layouts/BPLayout"

export class BPWidget extends BPObject {
    private _theme: BPThemeProperty = null
    protected mainLayout: BPLayout = null

    protected paint() {}
    protected hitSize() {}
}
