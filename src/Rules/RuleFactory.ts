import { FlatRule, TRule } from "../types/rules.types"
import { NewPropertyRule } from "./propertyRule"
import { NewTagRule } from "./tagRule"

export function RuleFactory(rules: FlatRule[]): Map<string,TRule> {
  let madeRules: Map<string, TRule> = new Map()
  rules.forEach((rule) => { 

    switch (rule.type) {
      case 'property':
        madeRules.set(rule.id, NewPropertyRule(rule))
        break
      case 'tag':
        madeRules.set(rule.id,NewTagRule(rule))
        break
    }
  })
  return madeRules
}