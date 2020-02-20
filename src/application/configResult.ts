class ConfigResult {
    private targetPath: string = ""
    private outputPath: string = ""
    private isAddon: boolean = true
    public setTarget(path: string) {
        this.targetPath = path
    }
    public setOutput(path: string) {
        this.outputPath = path
    }
    public getTarget() {
        return this.targetPath
    }
    public getOutput() {
        return this.outputPath
    }
    public setIsAddon(isAddonResult: boolean) {
        this.isAddon = isAddonResult
    }
    public getIsAddon() {
        return this.isAddon
    }
}
export default new ConfigResult()
