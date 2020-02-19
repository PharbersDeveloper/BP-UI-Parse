#! /usr/bin/env node

import program from "commander"
import path from "path"
import config from "../conf/config"
import BPApplication from "./application/BPApplication"

program
    .version("0.1.0")
    .option("-c, --config <path>", "config file path", "conf/config.ts")
    .option("-o, --output <path>", "output path", "output")
    .option("-t, --target <path>", "target file path", "test/data/components/main.json")
    .option("-a, --addon", "is addon or project", true)

program.parse(process.argv)

const PATH = process.argv[1]
const outputPath = path.resolve(PATH, config.outputPath)
const targetFile =  path.resolve(PATH, config.targetFile)
config.outputPath = outputPath
config.targetFile = targetFile

new BPApplication().run()
