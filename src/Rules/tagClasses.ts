import { midFile } from "../classification/ClassifiedFile";
import { baseClass, BaseClassRule } from "./Classification";

interface tagRule {
  tag: string,
  match: "includes"|"exact",
}
export interface FlatTagClass extends baseClass {
  type: 'tag',
  rule: tagRule[]
}

export class TagClass extends BaseClassRule<FlatTagClass>{
  private tagRules: tagRule[]
  constructor(data: FlatTagClass) {
    super(data)
    this.tagRules = data.rule
  }

  match(file: midFile): boolean{
    if (!file.tags || file.tags.length== 0 ) return false
    for (const rule of this.tagRules) {
      let check:boolean = false
      switch (rule.match) {
        case "includes":
          check = this.includeMatch(file.tags, rule)
          break
        case "exact":
          check = this.exactMatch(file.tags, rule)
          break
      }
      if (!check) return false
    }
    return true
  }
  private includeMatch(tags: Array<string>, rule: tagRule): boolean{
    const splitTags:Array<string>=[]
    for (const tag of tags) {
      splitTags.push(...tag.split("/"))
    }
    const check = splitTags.find((t) => t == rule.tag)
    if (!check) return false
    return true
  }

  private exactMatch(tags: Array<string>, rule: tagRule): boolean{
    const check = tags.find((t) => t == rule.tag)
    if (!check) return false
    return true
  }
}