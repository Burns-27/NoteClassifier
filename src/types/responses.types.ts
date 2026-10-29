import { TCls } from "./classifications.types"
import { TClsFile } from "./files.types"

export type FailRes = {
  success: false,
  message?: string,
  context?:Record<string,unknown>
}
export type updateRes = {
  success:true,
  moved: boolean, 
  flagged:boolean,
}| FailRes

export type ClsRes = {
  success: true, 
  cls: TCls 
} | FailRes


export type NoteClsRes = {
  success: true,
  note: TClsFile
}|FailRes

export type ClsPathRes = {
  success: true,
  path:string[], 
}|FailRes
export type ClsPropsRes = {
  success: true,
  props:string[]
}|FailRes

export type RuleMatchRes = {
  success: true,
} | FailRes



export type UpdateClsRes = {
  success: true,
  cls: TCls,
} 


