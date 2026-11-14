import { FrontMatterCache } from "obsidian";
import { FlatReqPropOptions, PropCheckRes,  } from "../types";
import { ReqProp } from "./ReqProp";
import { getPropertyStringValue } from "../tools/propertyUtils";

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
  check(fm:FrontMatterCache): PropCheckRes{
    const check = getPropertyStringValue(this.propName, fm)
    if (!check) {
      return {check:false, type:'has', prop:this.propName}
    }
    if (!this.propValueOptions.includes(check)) {
      return{check:false, type:"opt", prop:this.propName}
    }
    return { check:true}
  }
}