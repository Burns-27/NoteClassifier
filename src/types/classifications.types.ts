import { Logs } from "../tools";
import { midFile } from "./files.types";
import { TReqProp, FlatReqProp } from "./reqProps.types";
import { TRule, FlatRule } from "./rules.types";



export interface TCls {
  readonly id: string;
  readonly parentID?: string | null;
  readonly name: string;
  readonly propOrder:string[]
  reqProps: Map<string, TReqProp>
  allReqProps: Map<string, TReqProp>;
  parentReqProps: Map<string, TReqProp>;
  rules: Map<string, TRule>, 
  path: string[],
  parent:TCls|false
  match: (file: midFile, log:Logs) => boolean,
  flat: FlatCls
  addRule: () => FlatRule
  addReqProp:()=>FlatReqProp
}

export type FlatCls = {
  id: string;
  parentID?: string | null;
  name: string
  rules: string[],
  destination: string,
  description?: string,
  requriedProperties: string[],
  propOrder?: string[],
  template?: string,
}

