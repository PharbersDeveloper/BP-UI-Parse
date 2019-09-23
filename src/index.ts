#! /usr/bin/env node
import program from "commander"
import * as fs from "fs"
import * as yaml from "js-yaml"
import { JsonConvert, ValueCheckingMode } from "json2typescript"
import { EmberAddonExec } from "./bashexec/addonExec"
import { BashSpwanCmds } from "./bashexec/bashcmdlst"
import { CdExec } from "./bashexec/cdExec"
import { EmberBlueprintExec } from "./bashexec/emberBluepirnt"
import { EmberGenExec } from "./bashexec/emberGenExec"
import { EmberInitBlueprintExec } from "./bashexec/emberInitBlueprint"
import { EmberYarnExec } from "./bashexec/emberYarn"
// import {DealComponentClass} from "./bashexec/execComponent/dealComponentClass"
import { GenerateStyle } from "./bashexec/generateStyle"
import { BasicUi } from "./components/BasicUi"
import { TotalStyle } from "./components/TotalStyle"
import { ParseConf } from "./factory/ParseFactory"
import phLogger from "./logger/phLogger"

program
    .version("0.1.0")
    .option("-d, --directory <directory>", "the ui generate file path")
    .option("-s, --style <style>", "the ui styles file path")
    .option("-m, --mode <mode>", "the output type of the result components, ember or react, only ember for now")
    .option("-o, --output <output>", "output to local distination dir")
    .option("-n, --name <name>", "output name")
    .action(exec)
    .parse(process.argv)

async function exec(options: any) {
    phLogger.info("start with args: ")
    let inputPath: string = options.directory
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

    let name: string = options.name
    if (!name || name === "") {
        name = "name"
        program.outputHelp()
        return 1
    }
    phLogger.info("name: " + name)

    let style: string = options.style
    if (!style || style === "") {
        style = "."
    }
    phLogger.info("style: " + style)

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

    // 获取 ui json
    const inputFileData = fs.readFileSync(inputPath, "utf8")
    const componentData = jsonConvert.deserializeObject(JSON.parse(inputFileData), BasicUi)

    // 获取 styles json
    const inputStyleData = fs.readFileSync(style, "utf8")
    const cssData = jsonConvert.deserializeObject(JSON.parse(inputStyleData), TotalStyle)

    /**
     * cmds explain
     * line0 进入输出目录
     * line1 生成 ember addon
     * line2 进入上一步生成的 addon 目录
     * line3 执行 yarn，安装依赖
     * line3.1 生成测试组件（即将删除）
     * line4 生成自定义 blueprint
     * line5 初始化 blueprint（index.js & __name__.js & __templatename__.hbs）
     * line6 测试 blueprint 的结果
     * todo 五个基础布局器
     * todo 生成 css 的blueprint ✅
     * todo 生成 page 页面
     * todo 将 组件 放入 page页面进行展示
     */
    const cmdlst = new BashSpwanCmds()
    phLogger.info("output: " + output)

    cmdlst.cmds = [
        new CdExec(output),
        new EmberAddonExec(name),
        new CdExec(output + "/" + name),
        new EmberYarnExec("install"),
        // new EmberGenExec("component", "test-component"),
        // new EmberGenExec("blueprint", componentData.components),
        new EmberInitBlueprintExec(inputPath, output, name, componentData.components),
        new EmberBlueprintExec(componentData),
        new GenerateStyle(cssData, output, name),
        // new DealComponentClass(componentData, output, name)
    ]

    cmdlst.exec()
}
