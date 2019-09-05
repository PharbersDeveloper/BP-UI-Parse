import program from "commander"
import * as fs from "fs"
import * as yaml from "js-yaml"
import { JsonConvert, ValueCheckingMode } from "json2typescript"
import { EmberAddonExec } from "./bashexec/addonExec"
import { BashSpwanCmds } from "./bashexec/bashcmdlst"
import { CdExec } from "./bashexec/cdExec"
import { ParseConf } from "./factory/ParseFactory"
import phLogger from "./logger/phLogger"

program
    .version("0.1.0")
    .option("-d, --dir <path>", "the ui generate file path")
    .option("-m, --mode <mode>", "the output type of the result components, ember or react, only ember for now")
    .option("-o, --output<output>", "output to local distination dir")
    .option("-n, --name <tname>", "output name")
    .action(exec)
    .parse(process.argv)

async function exec(options: any) {
    phLogger.info("start with args: ")
    let inputPath: string = options.path
    if (!inputPath || inputPath === "") {
        inputPath = "."
    }
    phLogger.info("dir: " + inputPath)

    let mode: string = options.mode
    if (!mode || mode === "") {
        mode = "ember"
    }
    phLogger.info("mode: " + mode)

    let output: string = options.output
    if (!output || output === "") {
        output = "."
        program.outputHelp()
        return 1
    }
    phLogger.info("output: " + output)

    let name: string = options.tname
    if (!name || name === "") {
        name = "name"
        program.outputHelp()
        return 1
    }
    phLogger.info("name: " + name)

    const path = process.env.PH_TS_UI_PARSE + "/conf"
    const jsonConvert: JsonConvert = new JsonConvert()
    const doc = yaml.safeLoad(fs.readFileSync(path + "/conf.yml", "utf8"))
    // jsonConvert.operationMode = OperationMode.LOGGING // print some debug data
    jsonConvert.ignorePrimitiveChecks = false // don't allow assigning number to string etc.
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL // never allow null
    const conf = jsonConvert.deserializeObject(doc, ParseConf)

    phLogger.info(conf)
    const m = conf.modes.find((x) => x.key === mode)
    let func = null
    if (m) {
        func = m.func
    }
    phLogger.info(func)

    /**
     * 1. 第一步创建ember addon
     */
    const cmdlst = new BashSpwanCmds()
    cmdlst.cmds = [
        new CdExec(output),
        new EmberAddonExec(name)
    ]

    cmdlst.exec()
}
