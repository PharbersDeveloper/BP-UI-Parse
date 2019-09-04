import program from "commander"
import phLogger from "./logger/phLogger"

// const program = require("commander")

program
    .version("0.1.0")
    .option("-C, --chdir <path>", "change the working directory")
    .option("-c, --config <path>", "set config path. defaults to ./deploy.conf")
    .option("-T, --no-tests", "ignore test hook")

program
    .command("setup [env]")
    .description("run setup commands for all envs")
    .option("-s, --setup_mode [mode]", "Which setup mode to use")
    .action((env: string, options: any) => {
        const mode = options.setup_mode || "normal"
        env = env || "all"
        phLogger.info("setup for %s env(s) with %s mode", env, mode)
    })

program
    .command("exec <cmd>")
    .alias("ex")
    .description("execute the given remote cmd")
    .option("-e, --exec_mode <mode>", "Which exec mode to use")
    .action((cmd: string, options: any) => {
        phLogger.info('exec "%s" using %s mode', cmd, options.exec_mode)
    }).on("--help", () => {
        phLogger.info("")
        phLogger.info("Examples:")
        phLogger.info("")
        phLogger.info("  $ deploy exec sequential")
        phLogger.info("  $ deploy exec async")
    })

program
    .command("*")
    .action((env: string) => {
        phLogger.info('deploying "%s"', env)
    })

program.parse(process.argv)
