#! /usr/bin/env node

import program from "commander"
import path from "path"
import BPApplication from "./application/BPApplication"
import configResult from "./application/configResult"
import phLogger from "./logger/phLogger"

// node . -e conf/frank.ts
program
    .version("0.1.0")
    .option("-e, --entry <path>", "config file path", "conf/config.ts")
    .option("-o, --output <path>", "output path")
    .option("-t, --target <path>", "target file path")
    .action(runBuild)
// .option("-a, --addon", "is addon or project", true)

program.parse(process.argv)

const PATH = process.argv[1]
const configPath = path.resolve(PATH, program.entry)

async function runBuild() {
    const config = await import(configPath)

    const { output, target } = program
    const outputPath = output ? path.resolve(PATH, output) : path.resolve(PATH, config.outputPath)
    const targetFile = target ? path.resolve(PATH, target) : path.resolve(PATH, config.targetFile)

    configResult.setOutput(outputPath)
    configResult.setTarget(targetFile)
    configResult.setIsAddon(config.isAddon)
    new BPApplication().run(configResult.getTarget())
}
