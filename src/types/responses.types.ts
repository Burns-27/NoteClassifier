import { TCls } from "./classifications.types"
import { TClsFile } from "./files.types"
import { FlatReqProp, TReqProp } from "./reqProps.types"
import { FlatRule } from "./rules.types"

export type FailRes = {
  success: false,
  message?: string,
  context?:Record<string,unknown>
}
export type updateRes = {
  success:true,
  ignored:boolean,
  moved: boolean, 
  flagged:boolean,
}| FailRes

export type ClsRes = {
  success: true, 
  cls: TCls 
} | FailRes
export type flatRuleRes = {
  success: true,
  rule:FlatRule
}|FailRes
export type flatPropRes = {
  success: true,
  prop:FlatReqProp
}|FailRes
export type NoteClsRes = {
  success: true,
  note: TClsFile
}|{success:false, message:'unable'|'ignored'|'error'}

export type ClsPathRes = {
  success: true,
  path:string[], 
}|FailRes
export type ClsPropsRes = {
  success: true,
  props:Map<string, TReqProp>
}|FailRes

export type RuleMatchRes = {
  success: true,
} | FailRes

export type PropCheckRes = {
  check: true,
} | {
  check: false, 
  type: "opt",
  prop:string
} | {
  check: false,
  type: 'has',
  prop:string
}

export type UpdateClsRes = {
  success: true,
  cls: TCls,
} 


