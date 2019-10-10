#! /usr/bin/env node

import BPApplication from "./application/BPApplication"

<<<<<<< Updated upstream
new BPApplication().run(process.argv)
=======
async function exec(options: any) {
    phLogger.info("start with args: ")
    let inputPath: string = options.directory
    if (!inputPath || inputPath === "") {
        inputPath = "."
    }
    phLogger.info("dir: " + inputPath)
new BPApplication().run(process.argv)

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
        new RemoveFolderExec(name),
        new EmberAddonExec(name),
        new CdExec(output + "/" + name),
        new EmberYarnExec("install"),
        new EmberInitBlueprintExec(inputPath, output, name, componentData.components),
        new EmberBlueprintExec(componentData),
        new GenerateStyle(cssData, output, name),
        new EmberYarnExec("remove", "ember-cli-htmlbars"),
        new EmberInstallDepExec("ember-cli-htmlbars", "-S"),
        new EmberInstallDepExec("@fortawesome/ember-fontawesome", "-S"),
        new EmberYarnExec("add", "@fortawesome/free-solid-svg-icons"),
        new CdExec(output + "/" + name),
        new EmberShowExec(output, name, componentData.components)
    ]

    cmdlst.exec()
}
>>>>>>> Stashed changes
