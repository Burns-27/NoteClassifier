
import { devlog } from "../logger"
import { midFile } from "../types/files.types"
import {  RuleMatchRes } from "../types/responses.types"
import { Rule } from "../types/rules.types"


export interface PropertyRule extends Rule {
  readonly type: "property"
  readonly matchType: "exact"
  propertyName: string,
  propertyValue: string,
}

type FlatExactPropertyRule = {
  type: "property",
  id:string,
  matchType: "exact"
  propertyName: string,
  propertyValue: string
}
export type FlatPropertyRule = FlatExactPropertyRule

export function NewPropertyRule(rule: FlatPropertyRule): PropertyRule{
  switch (rule.matchType) {
    case "exact":
      return new ExactPropertyRule(rule)
  }
}



class ExactPropertyRule implements PropertyRule {
  readonly propertyName: string
  readonly type = "property"
  readonly matchType = "exact"
  readonly propertyValue: string
  id: string
  flat: FlatExactPropertyRule;
  readonly desc: string
  constructor(data: FlatExactPropertyRule) {
    this.propertyName = data.propertyName
    this.propertyValue = data.propertyValue
    this.id = data.id
    this.flat = data
    this.desc = `File Has '${this.propertyName}' Property with '${this.propertyValue}' as its value`
  }
  match(file: midFile): RuleMatchRes{
    const frontmatter = file.metadataCache.frontmatter
    if (!frontmatter) {
      devlog.test("No frontmatter found")
      return {
      success: false,
      message:"No Frontmatter on file"
    }}
    if (!frontmatter[this.propertyName]) {
      devlog.test("Property doesnt exist", {filesFrontmatter:frontmatter, property:this.propertyName})
      return {
      success: false,
      message:"Property doesnt Exist on file"
    }}
    if (frontmatter[this.propertyName] !== this.propertyValue) {
      devlog.test("Property doesnt match", {filesProperty:frontmatter, expectedValue: this.propertyValue})
      return {
      success: false,
      message:"Property Value doesnt Match"
    }}
    return {
      success: true,
    }
  }
  getDesc() {
    return `File ${this.propertyName} has value ${this.propertyValue}`
  }
}