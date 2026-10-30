
import { devlog } from "../logger"
import { midFile } from "../types/files.types"
import { FailRes, RuleMatchRes } from "../types/responses.types"
import { Rule } from "../types/rules.types"


export interface TagRule extends Rule{
  readonly type:"tag"
  readonly matchType: "includes" | "exact",
  tag: string,
}

type FlatExactTagRule = {
  type: "tag",
  id:string,
  matchType: "exact",
  tag: string,
}
type FlatIncludeTagRule = {
  type: "tag",
  id:string, 
  matchType: "include",
  tag: string,
}
export type FlatTagRule = FlatExactTagRule | FlatIncludeTagRule
export function NewTagRule(rule: FlatTagRule): TagRule{
  switch (rule.matchType) {
    case "exact":
      return new ExactTagRule(rule)
    case "include":
      return new IncludeTagRule(rule)
  }
}
class ExactTagRule implements TagRule{
  readonly type = "tag"
  readonly matchType = "exact";
  tag: string
  id: string
  flat:FlatExactTagRule
  constructor(data: FlatExactTagRule) {
    this.tag = data.tag
    this.id = data.id
    this.flat = data
  }

  match(file: midFile): RuleMatchRes{
    devlog.loc('Match - Exact Tag Rule', 'Begining',{tag:this.tag, file})
    if (!file.tags || file.tags.length == 0) {
      const res: FailRes = {
        success: false,
        message:"File Has no tags"
      }
      devlog.loc('Match - Exact Tag Rule',"Tag Exact Match Fail", res)
      return res
      }
    const check = file.tags.find((t) => t == this.tag) 
    if (!check) {
      const res:FailRes = { success: false, message: "File doesnt have matching tag", context: { fileTags: file.tags, expectedTag: this.tag } }
      devlog.loc('Match - Exact Tag Rule',"Tag Exact Match Fail", res)
      return res
    }
    return {
      success: true,
    }
  }
  getDesc(): string{
    return ` has #${this.tag}`
  }
}

class IncludeTagRule implements TagRule {
  readonly type = "tag"
  readonly matchType = "includes";
  tag: string
  id: string
  flat:FlatIncludeTagRule
  constructor(data: FlatIncludeTagRule) {
    this.tag = data.tag
    this.id = data.id
    this.flat = data
  }
  match(file: midFile): RuleMatchRes{
    if (!file.tags || file.tags.length == 0) {
      const res: FailRes = {
        success: false,
        message:"File has No Tags"
      }
      devlog.loc('Match - Include Tag Rule',"Tag Include Match Fail", res)
      return res
    }
    const splitTags: string[] = []
    for (const tag of file.tags) {
      splitTags.push(...tag.split('/'))
    }
    const check = splitTags.find((t) => t == this.tag)
    if (!check) {
      const res: FailRes = {
        success: false,
        message: "No matching tags",
        context: {
          fileTags: file.tags,
          splitTags: splitTags,
          goalTag:this.tag,
        }
      }
      devlog.loc('Match - Include Tag Rule',"No matching tag", res)
      return res
    }
    return {
      success: true,
    }
  }
  getDesc() {
    return `includes '#${this.tag}'`
  }
}