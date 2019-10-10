#! /usr/bin/env node

import BPApplication from "./application/BPApplication";

const app = new BPApplication()
app.init(process.argv)
