import { FlatRule, TRule } from "../types/rules.types"
import { NewPropertyRule } from "./propertyRule"
import { NewTagRule } from "./tagRule"

export function RuleFactory(rules: Map<string,FlatRule>): Map<string,TRule> {
  let madeRules: Map<string, TRule> = new Map()
  rules.forEach((rule, key) => { 

    switch (rule.type) {
      case 'property':
        madeRules.set(key, NewPropertyRule(rule))
        break
      case 'tag':
        madeRules.set(key,NewTagRule(rule))
        break
    }
  })
  return madeRules
}