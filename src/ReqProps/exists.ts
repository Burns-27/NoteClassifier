
import type { FlatReqPropHas,  TClsFile } from "../types"
import { ReqProp } from "./ReqProp"
import { settings } from "../settings/settings"
import { Logs } from "../tools"



export class ReqPropHas extends ReqProp {
    public flat: FlatReqPropHas
    constructor(data: FlatReqPropHas, clsName: string) {
        super(data, clsName)
        this.flat = data
    }
    get desc(): string {
        return `File has "${this.propName}" property, and it is not empty`
    }
    check(file:TClsFile, log:Logs) {
        const check = file.checkPropExists(this.propName)
        log.add(`Check ${this.propName}`, check)
        if (check) {
            return 
        }
        if (settings.base.addMissingProps) { 
            file.addFM(this.propName, this.flat.defaultValue)
        }
        file.flags.propsMissing = true
        return 
    }
}