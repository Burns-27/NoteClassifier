
import { FlatPropertyRule, PropertyRule } from "../Rules/propertyRule"
import { FlatTagRule, TagRule } from "../Rules/tagRule"
import { midFile, TClsFile } from "./files.types"
import { PropCheckRes, RuleMatchRes } from "./responses.types"

export type FlatRule = FlatTagRule | FlatPropertyRule
export type TRule = Rule & (TagRule | PropertyRule)

export interface Rule {
  getDesc: () => string,
  match: (file: midFile) => RuleMatchRes
  id: string,
  flat:FlatRule,
}


export type FlatReqPropHas = {
  type: "exists",
  propertyName: string,
} & flatPropBase
export type FlatReqPropOptions = {
  type: "one of",
  propertyName: string,
  propVauleOptions: string[]
} & flatPropBase;
type flatPropBase = {id:string}
export type FlatReqProp =  FlatReqPropOptions | FlatReqPropHas
export interface TReqProp {
  id: string, 
  flat: FlatReqProp,
  check: (note:TClsFile) => PropCheckRes,
  getDesc:()=>string, 
}