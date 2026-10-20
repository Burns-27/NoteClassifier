import { FlatPropertyRule, PropertyRule } from "../Rules/propertyRule"
import { FlatTagRule, TagRule } from "../Rules/tagRule"
import { midFile } from "./files.types"

export type FlatRule = FlatTagRule | FlatPropertyRule
export type TRule = Rule & (TagRule | PropertyRule)

export interface Rule {
  getDesc: () => string,
  match: (file: midFile) => boolean
  id: string,
}