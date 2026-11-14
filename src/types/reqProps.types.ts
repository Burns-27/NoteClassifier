import { FrontMatterCache } from "obsidian";
import { PropCheckRes } from "./responses.types";

type flatPropBase = {id:string}
export type FlatReqProp = FlatReqPropOptions | FlatReqPropHas


export interface TReqProp {
  id: string, 
  flat: FlatReqProp,
  clsName:string
  check: (fm:FrontMatterCache) => PropCheckRes,
  desc:string, 
}
export type FlatReqPropHas = {
  type: "exists",
  propertyName: string,
} & flatPropBase
export type FlatReqPropOptions = {
  type: "opt",
  propertyName: string,
  propVauleOptions: string[]
} & flatPropBase;

