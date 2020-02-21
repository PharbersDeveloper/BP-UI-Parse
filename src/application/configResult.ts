class ConfigResult {
    private targetPath: string = ""
    private outputPath: string = ""
    private isAddon: boolean = true
    private addonName: string = "basic-components"
    public setTarget(path: string) {
        this.targetPath = path
    }
    public setOutput(path: string) {
        this.outputPath = path
    }
    public setIsAddon(isAddonResult: boolean) {
        this.isAddon = isAddonResult
    }
    // TODO setAddonName
    public getTarget() {
        return this.targetPath
    }
    public getOutput() {
        return this.outputPath
    }

    public getIsAddon() {
        return this.isAddon
    }
    public getAddonName() {
        return this.addonName
    }
}
export default new ConfigResult()
