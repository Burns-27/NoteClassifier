import { midFile } from "../classification/ClassifiedFile";

export interface TagRule {
  readonly type:"tag"
  readonly matchType: "includes" | "exact",
  tag: string,
  readonly desc:string,
  match: (file: midFile) => boolean,
}

type FlatExactTagRule = {
  type: "tag",
  matchType: "exact",
  tag: string,
}
type FlatIncludeTagRule = {
  type: "tag",
  matchType: "include",
  tag: string,
  desc:string
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
  readonly desc: string
  constructor(data: FlatExactTagRule) {
    this.tag = data.tag
    this.desc = `File has ${data.tag}, exactly`
  }

  match(file: midFile): boolean{
    if (!file.tags || file.tags.length == 0) return false
    const check = file.tags.find((t) => t == this.tag) 
    if (!check) return false
    return true
  }
}

class IncludeTagRule implements TagRule {
  readonly type = "tag"
  readonly matchType = "includes";
  tag: string
  readonly desc:string
  constructor(data: FlatIncludeTagRule) {
    this.tag = data.tag
    this.desc = `File Includes ${data.tag}`
  }
  match(file: midFile): boolean{
    if (!file.tags || file.tags.length == 0) return false
    const splitTags: string[] = []
    for (const tag of file.tags) {
      splitTags.push(...tag.split('/'))
    }
    const check = splitTags.find((t) => t == this.tag)
    if (!check) return false
    return true
  }
}