import { settingUtil } from "../settings/settingsUtil";
import { type TClsFile } from "../types/files.types";
import { PropCheckRes } from "../types/responses.types";
import { FlatReqPropHas, FlatReqPropOptions, TReqProp } from "../types/rules.types";

export function reqPropFactory(idArray: string[]): Map<string, TReqProp> {
  let map = new Map<string, TReqProp>()
  for (const id of idArray) {
    const flatReqPropRes = settingUtil.getFlatReqProp(id)
    if (flatReqPropRes.success) {
      const flatReqProp = flatReqPropRes.prop
      switch (flatReqProp.type) {
        case "one of":
          map.set(flatReqProp.id, new ReqPropOptions(flatReqProp))
          break
        case "exists":
          map.set(flatReqProp.id, new ReqPropHas(flatReqProp))
          break
      }
    }
  }
  return map
}

class ReqPropHas implements TReqProp {
  public id: string
  public flat: FlatReqPropHas
  private propName: string
  constructor(data: FlatReqPropHas) {
    this.id=  data.id
    this.flat = data
    this.propName= data.propertyName
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
  constructor(data: FlatReqPropOptions) {
    this.id = data.id
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