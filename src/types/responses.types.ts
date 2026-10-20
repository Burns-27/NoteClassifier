import { FlatCls, TCls } from "./classifications.types"
import { TClsFile } from "./files.types"
export type ActionResult = FailRes | SuccessRes

type FailRes = {
  success: false,
  message?: string,
  context?:Record<string,unknown>
}

type SuccessRes = ClsRes|FlatClsRes|ClsMatchRes|NoteClsRes

type ClsRes = {
  success:true, 
  type: "Cls Get"
  cls: TCls 
}

type FlatClsRes = {
  success: true,
  type: "flat CLs Get",
  cls: FlatCls
}
type ClsMatchRes = {
  success: true,
  type: "cls match",
  cls:TCls
}
type NoteClsRes = {
  success: true,
  type: "note cls",
  note: TClsFile
}