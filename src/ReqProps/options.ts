import { FlatReqPropOptions, PropCheckRes, TClsFile } from "../types";
import { ReqProp } from "./ReqProp";

export class ReqPropOptions extends ReqProp{
  
  private propValueOptions: string[]
 flat: FlatReqPropOptions
  constructor(data: FlatReqPropOptions, clsName:string) {
    super(data, clsName)
    this.flat = data
    this.propValueOptions = data.propVauleOptions
  }
  getDesc(): string{
    return `File has ${this.propName} property, and its value is one of:  "${this.propValueOptions.join('", "')}"`
  }
  check(note: TClsFile): PropCheckRes{
    const check = note.getPropValue(this.propName)
    if (!check) {
      return {check:false, type:'has', prop:this.propName}
    }
    if (!this.propValueOptions.includes(check)) {
      return{check:false, type:"opt", prop:this.propName}
    }
    return { check:true}
  }
}