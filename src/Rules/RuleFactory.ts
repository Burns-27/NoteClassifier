import { FlatRule, TRule } from "../types/rules.types"
import { NewPropertyRule } from "./propertyRule"
import { NewTagRule } from "./tagRule"

export function RuleFactory(rules: FlatRule[]): TRule[] {
  let madeRules: TRule[] = []
  for (const rule of rules) {
    switch (rule.type) {
      case 'property':
        madeRules.push(NewPropertyRule(rule))
        break
      case 'tag':
        madeRules.push(NewTagRule(rule))
        break
    }
  }
  return madeRules
}