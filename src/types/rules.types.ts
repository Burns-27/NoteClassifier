import { midFile, TClsFile } from "./files.types"
import { PropCheckRes, RuleMatchRes } from "./responses.types"
export type FlatRule = FlatTagRule | FlatPropertyRule

export interface TRule {
  getDesc: () => string,
  match: (file: midFile) => RuleMatchRes
  clsName: string
  id: string,
  flat:FlatRule,
}
export type RuleTypeOpts = 'tag' | 'property'
export type MatchTypeOpts = 'exact' | 'include'

export type FlatExactTagRule = {
  type: "tag",
  id:string,
  matchType: "exact",
  tag: string,
}
export type FlatIncludeTagRule = {
  type: "tag",
  id:string, 
  matchType: "include",
  tag: string,
}
export type FlatTagRule = FlatExactTagRule | FlatIncludeTagRule


export type FlatExactPropertyRule = {
  type: "property",
  id:string,
  matchType: "exact"
  propertyName: string,
  propertyValue: string
}

export type FlatPropertyRule = FlatExactPropertyRule


export type FlatReqPropHas = {
  type: "exists",
  propertyName: string,
} & flatPropBase
export type FlatReqPropOptions = {
  type: "opt",
  propertyName: string,
  propVauleOptions: string[]
} & flatPropBase;

type flatPropBase = {id:string}
export type FlatReqProp = FlatReqPropOptions | FlatReqPropHas


export interface TReqProp {
  id: string, 
  flat: FlatReqProp,
  clsName:string
  check: (note:TClsFile) => PropCheckRes,
  getDesc:()=>string, 
}