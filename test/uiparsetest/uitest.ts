import { slow, suite, test, timeout } from "mocha-typescript"
import BPApplication from "../../src/application/BPApplication"
import PhLogger from "../../src/logger/phLogger"

@suite(timeout(1000 * 60), slow(1000))
class ExcelDataInput {

    public static before() {
        PhLogger.info(`before starting the test`)
    }

    public static after() {
        PhLogger.info(`after starting the test`)
    }

    @test public async uiparsetest() {
        PhLogger.info(`start application test`)
        new BPApplication().run()
    }
}
