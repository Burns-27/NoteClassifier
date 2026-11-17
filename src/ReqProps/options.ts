
import { settings } from "../settings/settings";
import { Logs } from "../tools";
import { FlatReqPropOptions, TClsFile,  } from "../types";
import { ReqProp } from "./ReqProp";

export class ReqPropOptions extends ReqProp{
  private propValueOptions: string[]
 flat: FlatReqPropOptions
  constructor(data: FlatReqPropOptions, clsName:string) {
    super(data, clsName)
    this.flat = data
    this.propValueOptions = data.propVauleOptions
  }
  get desc(): string{
    return `File has "${this.propName}" property, and its value is one of:  "${this.propValueOptions.join('", "')}"`
  }
  check(file:TClsFile, log:Logs){
    const check = file.checkPropExists(this.propName)
    log.add(`Check ${this.propName}`, check)
    if (!check) {
      if(settings.base.addMissingProps) {
        file.addFM(this.propName, this.flat.defaultOption)
      }
      file.flags.propsMissing = true
      return 
    }
    const value = file.getPropertyString(this.propName)
    log.add(`Check ${this.propName} value`, value)
    if (!value || !this.propValueOptions.includes(value)) {
      file.flags.propsInvalid = true
      return 
    }
    return 
  }
}