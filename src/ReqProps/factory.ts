import { settingUtil } from "../settings/settingsUtil"
import { FlatReqProp, TReqProp } from "../types"
import { ReqPropHas } from "./exists"
import { ReqPropOptions } from "./options"

export function reqPropFactory(idArray: string[], clsName:string): Map<string, TReqProp> {
  let map = new Map<string, TReqProp>()
  for (const id of idArray) {
    //TODO (Settings Refactor) Replace this with reqProp get 
    const flatReqPropRes = settingUtil.getFlatReqProp(id)
    if (flatReqPropRes.success) {
      const flatReqProp = flatReqPropRes.prop
      map.set(id, CreateReqProp(flatReqProp, clsName))
    }
  }
  return map
}
export function CreateReqProp(flat: FlatReqProp, clsName: string): TReqProp{
    switch (flat.type) {
      case "opt":
        return new ReqPropOptions(flat, clsName)
      case "exists":
        return new ReqPropHas(flat,clsName)
    }
  }