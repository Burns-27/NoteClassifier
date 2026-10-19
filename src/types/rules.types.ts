import { FlatPropertyRule, PropertyRule } from "../Rules/propertyRule"
import { FlatTagRule, TagRule } from "../Rules/tagRule"

export type FlatRule = FlatTagRule | FlatPropertyRule
export type TRule = TagRule | PropertyRule

