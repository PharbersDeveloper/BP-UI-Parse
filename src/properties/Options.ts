import BPComp from "../widgets/Comp"

export interface IOptions {
    output: string
    pName: string
    rName: string
    comp: BPComp
    logicData: string
    hbsData?: string
    styleData: string
    showData: string
}
export interface IAttrs {
    value: any
    name: string
    type: string
}
