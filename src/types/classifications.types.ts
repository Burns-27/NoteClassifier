
import type { midFile } from "./files.types";
import type { ClsRes } from "./responses.types";
import { FlatReqProp, FlatRule, TReqProp, TRule } from "./rules.types";

export interface TCls {
  readonly id: string;
  readonly parentID?: string | null;
  readonly name: string;
  reqProps: Map<string, TReqProp>
  allReqProps: Map<string, TReqProp>;
  parentReqProps: Map<string, TReqProp>;
  rules: Map<string, TRule>, 
  path: string[],
  parent:TCls|false
  match: (file: midFile) => ClsRes,
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

