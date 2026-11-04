import { settingUtil } from "../settings/settingsUtil";
import { type TClsFile } from "../types/files.types";
import { PropCheckRes } from "../types/responses.types";
import { FlatReqProp, FlatReqPropHas, FlatReqPropOptions, TReqProp } from "../types/rules.types";

export function reqPropFactory(idArray: string[], clsName:string): Map<string, TReqProp> {
  let map = new Map<string, TReqProp>()
  for (const id of idArray) {
    const flatReqPropRes = settingUtil.getFlatReqProp(id)
    if (flatReqPropRes.success) {
      const flatReqProp = flatReqPropRes.prop
      map.set(id, ReqProp.Create(flatReqProp, clsName))
    }
  }
  return map
}
abstract class ReqProp {
  public id: string
  abstract flat: FlatReqProp
  public propName: string
  public clsName: string
  constructor(data: FlatReqProp, clsName: string) {
    this.clsName = clsName
    this.id = data.id
    this.propName = data.propertyName
  }
  static Create(flat: FlatReqProp, clsName: string): TReqProp{
    switch (flat.type) {
      case "opt":
        return new ReqPropOptions(flat, clsName)
      case "exists":
        return new ReqPropHas(flat,clsName)
    }
  }
}
class ReqPropHas extends ReqProp implements TReqProp {
  public flat: FlatReqPropHas
  constructor(data: FlatReqPropHas, clsName:string) {
    super(data, clsName)
    this.flat = data
  }
  getDesc(): string{
    return `File has ${this.propName} property, and it is not empty`
  }
  check(note: TClsFile): PropCheckRes{
    const check = note.getPropValue(this.propName)
    if (!check) {
      return {
        check: false,
        type: 'has',
        prop: this.propName
      }
    }
    return {check:true}
  }
}

class ReqPropOptions implements TReqProp {
  public id: string
  public flat: FlatReqPropOptions
  private propName: string
  private propValueOptions: string[]
  public clsName: string; 
  constructor(data: FlatReqPropOptions, clsName:string) {
    this.id = data.id
    this.clsName = clsName
    this.flat = data
    this.propName = data.propertyName
    this.propValueOptions = data.propVauleOptions
  }
  getDesc(): string{
    return `File has ${this.propName} property, and its value is one of:  ${this.propValueOptions.join(', ')}`
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