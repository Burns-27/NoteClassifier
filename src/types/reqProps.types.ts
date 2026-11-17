
import { Logs } from "../tools";
import { TClsFile } from "./files.types";

type flatPropBase = {id:string}
export type FlatReqProp = FlatReqPropOptions | FlatReqPropHas


export interface TReqProp {
  id: string, 
  flat: FlatReqProp,
  clsName:string
  check: (file:TClsFile, log:Logs) => void,
  desc: string, 
}
export type FlatReqPropHas = {
  type: "exists",
  propertyName: string,
  defaultValue: string,
} & flatPropBase
export type FlatReqPropOptions = {
  type: "opt",
  propertyName: string,
  propVauleOptions: string[]
  defaultOption:string
} & flatPropBase;

